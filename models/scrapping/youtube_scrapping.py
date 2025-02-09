from googleapiclient.discovery import build
import os
from dotenv import load_dotenv

load_dotenv()

def youtube_search(query, max_results=20):
    api_key = os.getenv("GOOGLE_API_KEY")  # Load API key from .env
    youtube = build("youtube", "v3", developerKey=api_key)

    # First API call: Search videos
    search_request = youtube.search().list(
        part="snippet",
        q=query,
        type="video",
        maxResults=max_results
    )
    search_response = search_request.execute()

    video_ids = [item['id']['videoId'] for item in search_response['items']]
    
    # Second API call: Get full video details
    video_request = youtube.videos().list(
        part="snippet,contentDetails,statistics",
        id=",".join(video_ids)
    )
    video_response = video_request.execute()

    results = []
    for item in video_response['items']:
        video_data = {
            "video_id": item['id'],
            "title": item['snippet']['title'],
            "description": item['snippet'].get('description', 'No description available'),
            "channel": item['snippet']['channelTitle'],
            "channel_id": item['snippet']['channelId'],
            "published_at": item['snippet']['publishedAt'],
            "duration": item['contentDetails']['duration'],  # ISO 8601 format (e.g., PT10M30S)
            "view_count": item['statistics'].get('viewCount', '0'),
            "like_count": item['statistics'].get('likeCount', '0'),
            "comment_count": item['statistics'].get('commentCount', '0'),
            "thumbnails": item['snippet']['thumbnails'],
            "url": f"https://www.youtube.com/watch?v={item['id']}",
            "embed_url": f"https://www.youtube.com/embed/{item['id']}"
        }
        results.append(video_data)

    return results

if __name__ == "__main__":
    search_results = youtube_search("drafting laws", max_results=20)

    if search_results:
        for i, video in enumerate(search_results):
            print(f"Video {i+1}:")
            print(f"Title: {video['title']}")
            print(f"Description: {video['description']}")  # Now retrieves full description
            print(f"Channel: {video['channel']} ({video['channel_id']})")
            print(f"Published At: {video['published_at']}")
            print(f"Duration: {video['duration']}")
            print(f"Views: {video['view_count']}")
            print(f"Likes: {video['like_count']}")
            print(f"Comments: {video['comment_count']}")
            print(f"URL: {video['url']}")
            print(f"Embed URL: {video['embed_url']}")
            print(f"Thumbnail: {video['thumbnails']['high']['url']}")
            print("-" * 100)
    else:
        print("No videos found.")
