import os
from googleapiclient.discovery import build
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

def youtube_search(query, max_results=5):
    api_key = os.getenv("GOOGLE_API_KEY")  # Load API key from environment variable
    if not api_key:
        print("Error: GOOGLE_API_KEY not found in environment variables.")
        return []

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
            "description": item['snippet']['description'],  # Should be full description
            "channel": item['snippet']['channelTitle'],
            "published_at": item['snippet']['publishedAt'],
            "video_id": item['id']['videoId'],
            "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
            "thumbnails": item['snippet']['thumbnails'],  # Thumbnails in different sizes
        }

        # Fetch additional video details like views, likes, etc.
        video_details = youtube.videos().list(
            part="statistics",
            id=item['id']['videoId']
        ).execute()

        if 'items' in video_details['items']:
            video_data["view_count"] = video_details["items"][0].get("statistics", {}).get("viewCount", "N/A")
            video_data["like_count"] = video_details["items"][0].get("statistics", {}).get("likeCount", "N/A")
            video_data["comment_count"] = video_details["items"][0].get("statistics", {}).get("commentCount", "N/A")

        results.append(video_data)

    return results

# Usage example
search_results = youtube_search("Django tutorials in one shot", max_results=5)

# Display only the first video link
if search_results:
    first_video = search_results[0]
    print(f"First video link: {first_video['url']}")
    print(f"Title: {first_video['title']}")
    print(f"Description: {first_video['description'][:1000]}...")  # Limit the description length to 1000 chars for visibility
    print(f"Channel: {first_video['channel']}")
    print(f"Published At: {first_video['published_at']}")
    print(f"View Count: {first_video.get('view_count', 'N/A')}")
    print(f"Like Count: {first_video.get('like_count', 'N/A')}")
    print(f"Comment Count: {first_video.get('comment_count', 'N/A')}")
    print(f"Thumbnails: {first_video['thumbnails']}\n")
else:
    print("No videos found.")
