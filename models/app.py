import asyncio

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from fastapi.middleware.cors import CORSMiddleware
from roadmap import roadmap  # Assuming synchronous function
from youtube_scrapping import youtube_search  # Assuming synchronous function
from pdf_scrapping import search_and_download_pdf  # PDF scraping module
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://marketlenss.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001"
    ],  # Allow only these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Input data model
class RoadmapInput(BaseModel):
    input_value: str

@app.post("/generate-roadmap")
async def generate_roadmap(data: RoadmapInput):
    """
    Generate a roadmap with YouTube videos and PDF resources.
    """
    try:
        # Fetch roadmap components asynchronously
        result = await asyncio.to_thread(roadmap, data.input_value)
        result_json = json.loads(result)
        length_json = len(result_json)

        # Add YouTube videos for each component asynchronously
        for i in range(length_json):
            search_results = await asyncio.to_thread(youtube_search, f"one shot video for {result_json[i]['name']}")
            if search_results:
                first_video = search_results[0]
                result_json[i]['embed_url'] = first_video['embed_url']
            else:
                result_json[i]['embed_url'] = "No video found"

        # Fetch PDFs for the overall roadmap topic
        pdf_result = await asyncio.to_thread(search_and_download_pdf, data.input_value)
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
        return {
            "roadmap": result_json,
            "pdf_links": pdf_links
        }

    except KeyError:
        raise HTTPException(status_code=500, detail="Error parsing roadmap data.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
