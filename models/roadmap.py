from langflow.load import run_flow_from_json
import warnings
import logging
import json
import uuid
import os 
from dotenv import load_dotenv

load_dotenv()
# Generate a unique session ID
session_id = str(uuid.uuid4())

# Suppress warnings and logs
warnings.filterwarnings("ignore")
logging.getLogger("langchain").setLevel(logging.ERROR)

# User input

def roadmap(input_value):

    # Tweaks with your API key and settings
    TWEAKS = {
        "GroqModel-LFxpd": {
            "groq_api_base": "https://api.groq.com",
            "groq_api_key": os.getenv("GROQ_API_KEY"),
            "model_name": "llama-3.1-8b-instant",
            "temperature": 0.2
        },
        "TextInput-PDOUC": {
            "input_value": input_value
        }
    }

    # Run the flow
    result = run_flow_from_json(
        flow="json/Roadmap_generator.json",
        input_value="message",
        session_id=session_id,  # Provide a session ID
        fallback_to_env_vars=True,  # Allows environment variable fallback
        tweaks=TWEAKS
    )

    # Extract the raw message text
    raw_message = result[0].outputs[0].results['text']

    # Ensure the text is properly cleaned and formatted
    if isinstance(raw_message, str):
        cleaned_message = json.dumps(json.loads(raw_message), indent=4)
        return cleaned_message
    else:
        cleaned_message = json.dumps(json.loads(raw_message.text), indent=4)
        return cleaned_message

    # Print the formatted JSON
    # print(cleaned_message)    




if __name__ == "__main__":

    result = roadmap(input_value="mern")
    result_json = json.loads(result)
    print(result_json[1]['name'])