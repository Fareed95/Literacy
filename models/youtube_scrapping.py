from googleapiclient.discovery import build
import os 
from dotenv import load_dotenv


load_dotenv()

def youtube_search(query, max_results=5):
    api_key = os.getenv("GOOGLE_API_KEY")   # Replace with your API key
    youtube = build("youtube", "v3", developerKey=api_key)

    request = youtube.search().list(
        part="snippet",
        q=query,
        type="video",  # You can use 'channel' or 'playlist' as well
        maxResults=max_results
    )
    response = request.execute()

    results = []
    for item in response['items']:
        video_data = {
            "title": item['snippet']['title'],
            "channel": item['snippet']['channelTitle'],
            "published_at": item['snippet']['publishedAt'],
            "video_id": item['id']['videoId'],
            "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",  # Regular YouTube URL
            "embed_url": f"https://www.youtube.com/embed/{item['id']['videoId']}"  # Embed URL for iframe
        }
        results.append(video_data)

    return results

if __name__ == "__main__":
# Usage example
    search_results = youtube_search("sex education in one shot", max_results=5)

    # Display only the first video link
    if search_results:
        first_video = search_results[0]
        print(f"First video : {first_video['url']}")
        print(f"First video link: {first_video['url']}")
        print(f"Embed URL for frontend: {first_video['embed_url']}")  # Print embed URL for frontend
    else:
        print("No videos found.")
