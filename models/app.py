import json
import os
from flask import Flask, request, jsonify
from concurrent.futures import ThreadPoolExecutor
from roadmap import roadmap  # Assuming synchronous function
from youtube_scrapping import youtube_search  # Assuming synchronous function
from pdf_scrapping import search_and_download_pdf  # PDF scraping module

app = Flask(__name__)
executor = ThreadPoolExecutor(max_workers=5)

# Define allowed origins for CORS (same as in FastAPI)
from flask_cors import CORS
CORS(app, origins=[
    "https://marketlenss.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001"
], supports_credentials=True)

# Input data model (using Flask's request format)
class RoadmapInput:
    def __init__(self, input_value):
        self.input_value = input_value

@app.route("/generate-roadmap", methods=["POST"])
def generate_roadmap():
    """
    Generate a roadmap with YouTube videos and PDF resources.
    """
    try:
        # Get data from request body
        data = request.get_json()
        input_value = data.get('input_value')
        
        if not input_value:
            return jsonify({"error": "input_value is required"}), 400
        
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

            # Cleanup downloaded PDF files
            for file_path in pdf_result["files"]:
                try:
                    os.remove(file_path)  # Remove the file after processing
                    print(f"Deleted PDF file: {file_path}")
                except Exception as e:
                    print(f"Error cleaning up file {file_path}: {e}")

        # Return the final response
        return jsonify({
            "roadmap": result_json,
            "pdf_links": pdf_links
        })

    except KeyError:
        return jsonify({"error": "Error parsing roadmap data."}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
