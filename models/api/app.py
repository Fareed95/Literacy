import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import json
import os
from flask import Flask, request, jsonify
from concurrent.futures import ThreadPoolExecutor
from llm.roadmap import roadmap  # Assuming synchronous function
from llm.search_query import search_query  # Assuming synchronous function
from llm.youtube_filteration import youtube_filteration_best  # Assuming synchronous function
from scrapping.youtube_scrapping import youtube_search  # Assuming synchronous function
from scrapping.pdf_scrapping import search_and_download_pdf  # PDF scraping module
from extraction.skill_extractor import extraction
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

'''
Data base configuration 
'''
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

def get_db_connection():
    return psycopg2.connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME
    )

def create_roadmap_table():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS roadmap (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,  -- New field for roadmap name
                roadmap_json TEXT NOT NULL,
                 is_completed INT DEFAULT 0,
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


'''
Flask app setup 
'''
app = Flask(__name__)
executor = ThreadPoolExecutor(max_workers=5)

# Define allowed origins for CORS
from flask_cors import CORS
CORS(app, origins=[
    "https://marketlenss.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001"
], supports_credentials=True)

'''
API BUILDING
'''
@app.route("/generate-roadmap", methods=["POST"])
def generate_roadmap():
    """
    Generate a roadmap with YouTube videos and PDF resources and save it to the database.
    """
    try:
        
        data = request.get_json()
        input_value = data.get('input_value')
        email = data.get('email')  

        if not input_value or not email:
            return jsonify({"error": "input_value and email are required"}), 400
        

        extractor = extraction(input_value)
        roadmap_result = executor.submit(roadmap, input_value)
        result_json = json.loads(roadmap_result.result())
        length_json = len(result_json)

        for i in range(length_json):
            # Get YouTube search query
            querry = search_query(main_topic=extractor, sub_topic=result_json[i]['name'])
            search_results = executor.submit(youtube_search, querry)
            print(search_results)
            search_results = search_results.result()
            print(search_results)

            # Get the list of video URLs directly
            best_videos = youtube_filteration_best(main_topic=extractor, sub_topic=result_json[i]['name'], json_field=search_results)

            # Directly assign the list to the roadmap component
            result_json[i]['videos'] = best_videos if best_videos else []

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
            roadmap_id = cursor.fetchone()[0]  # Fetch the ID of the newly created roadmap
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

@app.route("/user-roadmaps", methods=["POST"])
def get_user_roadmaps():
    """
    Fetch all roadmaps for a specific user by email.
    """
    try:
        # Get email from request body
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "email is required"}), 400

        # Fetch roadmaps from the database
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            # Get user ID from email
            cursor.execute("SELECT id FROM api_user WHERE email = %s;", (email,))
            user_id = cursor.fetchone()
            if not user_id:
                return jsonify({"error": "User not found"}), 404

            # Fetch all roadmaps for the user
            cursor.execute(
                "SELECT id, name, roadmap_json FROM roadmap WHERE user_id = %s;",
                (user_id[0],)
            )
            roadmaps = cursor.fetchall()
            cursor.close()
            conn.close()

            # Convert roadmap_json from string to JSON and prepare response
            roadmap_list = []
            for roadmap in roadmaps:
                roadmap_id, name, roadmap_json_str = roadmap
                roadmap_json = json.loads(roadmap_json_str)  # Convert string to JSON
                roadmap_list.append({
                    "id": roadmap_id,
                    "name": name,
                    "roadmap_json": roadmap_json
                })

            return jsonify(roadmap_list), 200

        except Exception as db_error:
            return jsonify({"error": f"Database error: {str(db_error)}"}), 500

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    
@app.route("/roadmaps/<int:roadmap_id>/complete", methods=["PATCH"])
def update_roadmap_completion(roadmap_id):
    """
    Update the is_completed field for a specific roadmap.
    """
    try:
        # Get data from request body
        data = request.get_json()
        is_completed = data.get('is_completed')

        # # Validate is_completed value
        # if is_completed not in [0, 1]:
        #     return jsonify({"error": "is_completed must be 0 or 1"}), 400

        # Update the roadmap in the database
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            # Check if the roadmap exists
            cursor.execute("SELECT id FROM roadmap WHERE id = %s;", (roadmap_id,))
            if not cursor.fetchone():
                return jsonify({"error": "Roadmap not found"}), 404

            # Update the is_completed field
            cursor.execute(
                "UPDATE roadmap SET is_completed = %s WHERE id = %s;",
                (is_completed, roadmap_id)
            )
            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({"message": "Roadmap completion status updated successfully"}), 200

        except Exception as db_error:
            return jsonify({"error": f"Database error: {str(db_error)}"}), 500

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    
@app.route("/roadmaps/<int:roadmap_id>", methods=["GET"])
def get_roadmap_by_id(roadmap_id):
    """
    Fetch a specific roadmap by its ID.
    """
    try:
        # Fetch roadmap from the database
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            # Fetch the roadmap by ID
            cursor.execute(
                "SELECT id, name, roadmap_json, is_completed FROM roadmap WHERE id = %s;",
                (roadmap_id,)
            )
            roadmap = cursor.fetchone()
            cursor.close()
            conn.close()

            # If roadmap not found, return 404
            if not roadmap:
                return jsonify({"error": "Roadmap not found"}), 404

            # Convert roadmap_json from string to JSON and prepare response
            roadmap_id, name, roadmap_json_str,is_completed = roadmap
            roadmap_json = json.loads(roadmap_json_str)  # Convert string to JSON

            return jsonify({
                "id": roadmap_id,
                "name": name,
                "roadmap_json": roadmap_json,
                "is_completed":is_completed
            }), 200

        except Exception as db_error:
            return jsonify({"error": f"Database error: {str(db_error)}"}), 500

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500    
    
@app.route("/roadmaps/<int:roadmap_id>/component", methods=["POST"])
def get_roadmap_component(roadmap_id):
    """
    Fetch a specific component from a roadmap by its ID and component index.
    """
    try:
        # Get component number from request body
        data = request.get_json()
        component_number = data.get('component_number')

        if component_number is None:
            return jsonify({"error": "component_number is required"}), 400

        # Fetch roadmap from the database
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            # Fetch the roadmap by ID
            cursor.execute(
                "SELECT id, name, roadmap_json FROM roadmap WHERE id = %s;",
                (roadmap_id,)
            )
            roadmap = cursor.fetchone()
            cursor.close()
            conn.close()

            # If roadmap not found, return 404
            if not roadmap:
                return jsonify({"error": "Roadmap not found"}), 404

            # Convert roadmap_json from string to JSON
            roadmap_id, name, roadmap_json_str = roadmap
            roadmap_json = json.loads(roadmap_json_str)  # Convert string to JSON

            # Check if roadmap_components exists and component_number is valid
            if "roadmap_components" not in roadmap_json:
                return jsonify({"error": "No components found in the roadmap"}), 404

            if not isinstance(roadmap_json["roadmap_components"], list):
                return jsonify({"error": "Invalid roadmap components format"}), 500

            if component_number < 0 or component_number >= len(roadmap_json["roadmap_components"]):
                return jsonify({"error": "Invalid component_number"}), 400

            # Get the specific component
            component = roadmap_json["roadmap_components"][component_number]

            return jsonify({
                "id": roadmap_id,
                "name": name,
                "component": component
            }), 200

        except Exception as db_error:
            return jsonify({"error": f"Database error: {str(db_error)}"}), 500

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    




# Run Flask app
if __name__ == '__main__':
    create_roadmap_table()  # Ensure roadmap table is created
    app.run(port=8001,debug=True)