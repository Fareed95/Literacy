from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
import re

def get_video_id_from_url(url):
    # Extract video ID from the URL
    video_id = re.search(r"(?<=v=)[^&]+", url)
    if not video_id:
        video_id = re.search(r"youtu\.be/([^?&]+)", url)
    return video_id.group(0) if video_id else None

def get_video_transcript(url):
    video_id = get_video_id_from_url(url)
    if not video_id:
        return "Invalid YouTube URL."

    try:
        # Fetch the transcript
        transcript = YouTubeTranscriptApi.get_transcript(video_id)

        # Format the transcript as plain text
        formatter = TextFormatter()
        formatted_transcript = formatter.format_transcript(transcript)
        return formatted_transcript
    except Exception as e:
        return f"Error fetching transcript: {e}"

# Usage example
youtube_url = "https://www.youtube.com/watch?v=JxzZxdht-XY"  # Replace with your YouTube URL
transcript = get_video_transcript(youtube_url)

if transcript.startswith("Error"):
    print(transcript)
else:
    print("Transcript:\n")
    print(transcript)
