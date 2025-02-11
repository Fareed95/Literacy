from langflow.load import run_flow_from_json
import os 
from dotenv import load_dotenv
import warnings
import logging
import json
import uuid

load_dotenv()
# Generate a unique session ID
session_id = str(uuid.uuid4())

# Suppress warnings and logs
warnings.filterwarnings("ignore")
logging.getLogger("langchain").setLevel(logging.ERROR)


def search_query(main_topic, sub_topic):
    TWEAKS = {
    "TextInput-BEu48": {
        "input_value": main_topic
    },
    "TextInput-nylvA": {
        "input_value": sub_topic
    },
    "GroqModel-Poyuw": {
        "groq_api_base": "https://api.groq.com",
        "groq_api_key": os.getenv("GROQ_API_KEY")   
    },
    }
    json_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "json"))
    json_file = os.path.join(json_dir, "Youtube_search_query.json")
    result = run_flow_from_json(
            flow=json_file,
            input_value="message",
            session_id=session_id,  # Provide a session ID
            fallback_to_env_vars=True,  # Allows environment variable fallback
            tweaks=TWEAKS
        )
    raw_message = result[0].outputs[0].results['text']
    # Ensure the text is properly cleaned and formatted
    # Ensure raw_message is properly parsed into a dictionary
    if isinstance(raw_message, str):
        cleaned_message = json.loads(raw_message)  # Convert JSON string to dictionary
    elif hasattr(raw_message, "text"):  # Handle object case
        cleaned_message = json.loads(raw_message.text)
    else:
        raise ValueError("Unexpected response format from LangFlow.")

    # Return only the search query
    return cleaned_message.get("search_query", "No search query found")

    

if __name__ == "__main__":
    import sys
    import os

    # Get the parent directory (models/) and add it to sys.path
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

    from scrapping.youtube_scrapping import youtube_search
    from llm.youtube_filteration import youtube_filteration_best
    main_topic = "Machine Learning"
    sub_topic = "Regression model"
    search =search_query(main_topic=main_topic, sub_topic=sub_topic)
    print(search)
    result = youtube_search(str(search), max_results=10)
    print(result)
    print(youtube_filteration_best(main_topic=main_topic,sub_topic=sub_topic, json_field=result))   