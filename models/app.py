import json
import os
from flask import Flask, request, jsonify
from concurrent.futures import ThreadPoolExecutor
from roadmap import roadmap  # Assuming synchronous function
from youtube_scrapping import youtube_search  # Assuming synchronous function
from pdf_scrapping import search_and_download_pdf  # PDF scraping module
from skill_extractor import extraction
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Fetch database credentials from .env
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Initialize Flask app
app = Flask(__name__)
executor = ThreadPoolExecutor(max_workers=5)

# Define allowed origins for CORS
from flask_cors import CORS
CORS(app, origins=[
    "https://marketlenss.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001"
], supports_credentials=True)

# Database connection function
def get_db_connection():
    return psycopg2.connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME
    )

# Create roadmap table if not exists
def create_roadmap_table():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS roadmap (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,  -- New field for roadmap name
                roadmap_json TEXT NOT NULL,
                user_id INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES api_user(id)
            );
        """)
        conn.commit()
        cursor.close()
        conn.close()
        print("Roadmap table created successfully (if not exists).")
    except Exception as e:
        print(f"Error creating roadmap table: {e}")

# API route to generate roadmap and save to database
@app.route("/generate-roadmap", methods=["POST"])
def generate_roadmap():
    """
    Generate a roadmap with YouTube videos and PDF resources and save it to the database.
    """
    try:
        # Get data from request body
        data = request.get_json()
        input_value = data.get('input_value')
        email = data.get('email')  # Get email from request

        if not input_value or not email:
            return jsonify({"error": "input_value and email are required"}), 400

        # Extract skills (roadmap name)
        extractor = extraction(input_value)
        print(extractor)

        # Generate roadmap
        roadmap_result = executor.submit(roadmap, input_value)
        result_json = json.loads(roadmap_result.result())
        length_json = len(result_json)

        # Add YouTube videos for each component
        for i in range(length_json):
            search_results = executor.submit(youtube_search, f"one shot video for {result_json[i]['name']}")
            search_results = search_results.result()
            if search_results:
                first_video = search_results[0]
                result_json[i]['embed_url'] = first_video['embed_url']
            else:
                result_json[i]['embed_url'] = "No video found"

        # Fetch PDFs for the overall roadmap topic
        pdf_result = executor.submit(search_and_download_pdf, input_value)
        pdf_result = pdf_result.result()
        if "error" in pdf_result:
            pdf_links = []
        else:
            pdf_links = pdf_result["links"]

        # Prepare final response
        final_response = {
            "roadmap_name": extractor,
            "roadmap_components": result_json,
            "pdf_links": pdf_links,
            "total_components": length_json
        }

        # Convert final response to string for storage
        roadmap_json_str = json.dumps(final_response)

        # Save roadmap to database
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            # Get user ID from email
            cursor.execute("SELECT id FROM api_user WHERE email = %s;", (email,))
            user_id = cursor.fetchone()
            if not user_id:
                return jsonify({"error": "User not found"}), 404

            # Insert roadmap into database with name field
            cursor.execute(
                "INSERT INTO roadmap (name, roadmap_json, user_id) VALUES (%s, %s, %s) RETURNING id;",
                (extractor, roadmap_json_str, user_id[0])
            )
            roadmap_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()

            # Add roadmap ID to the response
            final_response["roadmap_id"] = roadmap_id

        except Exception as db_error:
            return jsonify({"error": f"Database error: {str(db_error)}"}), 500

        # Return the final response
        return jsonify(final_response), 200

    except KeyError:
        return jsonify({"error": "Error parsing roadmap data."}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# Run Flask app
if __name__ == '__main__':
    create_roadmap_table()  # Ensure roadmap table is created
    app.run(debug=True)