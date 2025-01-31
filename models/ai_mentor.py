from langflow.load import run_flow_from_json
import warnings
import logging
import json
import uuid
import os 
from dotenv import load_dotenv

load_dotenv()
session_id = str(uuid.uuid4())

warnings.filterwarnings("ignore")
logging.getLogger("langchain").setLevel(logging.ERROR)

def ai_mentor(input_value, session_id_component):

    TWEAKS = {
    "ChatInput-cjWJK": {
        "input_value": input_value,
    },

    "GroqModel-v1qB4": {
        "groq_api_base": "https://api.groq.com",
        "groq_api_key": os.getenv("GROQ_API_KEY"),
        "model_name": "llama-3.1-8b-instant",
        "temperature": 0.2
    },
    "TextInput-Ob80U": {
        "input_value": session_id_component
    }
    }

    result = run_flow_from_json(flow="json/Memory Chatbot.json",
                            input_value="message",
                            session_id= session_id_component, 
                            fallback_to_env_vars=True, 
                            tweaks=TWEAKS)
    print(result)
    print("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")    
    raw_message = result[0].outputs[0].results['message']

    
    return raw_message

if __name__ == "__main__":
    input_value = "what is my name ?"
    session_id_component = "far"
    print(ai_mentor(input_value=input_value, session_id_component=session_id_component))  