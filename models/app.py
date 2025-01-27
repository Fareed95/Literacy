import nest_asyncio
import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json

# Apply nest_asyncio to allow nesting of event loops
nest_asyncio.apply()

from roadmap import roadmap  # Assuming synchronous function
from youtube_scrapping import youtube_search  # Assuming synchronous function

app = FastAPI()

class RoadmapInput(BaseModel):
    input_value: str

@app.post("/generate-roadmap")
async def generate_roadmap(data: RoadmapInput):
    try:
        # Sync calls - no await needed
        result = roadmap(input_value=data.input_value)
        result_json = json.loads(result)
        length_json = len(result_json)

        # Sync calls - no await needed
        for i in range(length_json):
            search_results = youtube_search(f"one shot video for {result_json[i]['name']}")
            if search_results:
                first_video = search_results[0]
                result_json[i]['embed_url'] = first_video['embed_url']
            else:
                result_json[i]['embed_url'] = "No video found"

        return {"roadmap": result_json}

    except KeyError:
        raise HTTPException(status_code=500, detail="Error parsing roadmap data.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
