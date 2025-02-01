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
  "ChatInput-Bp974": {
    "background_color": "",
    "chat_icon": "",
    "files": "",
    "input_value": input_value,
    "sender": "User",
    "sender_name": "User",
    "session_id": session_id_component,
    "should_store_message": True,
    "text_color": ""
  },
  "ChatOutput-6HuYU": {
    "background_color": "",
    "chat_icon": "",
    "data_template": "{text}",
    "input_value": "",
    "sender": "Machine",
    "sender_name": "AI",
    "session_id": session_id_component,
    "should_store_message": True,
    "text_color": ""
  },
  "Memory-uYZj8": {
    "n_messages": 100,
    "order": "Ascending",
    "sender": "Machine and User",
    "sender_name": "",
    "session_id": session_id_component,
    "template": "{sender_name}: {text}"
  },
  "Prompt-obAuK": {
    "memory": "",
    "template": "You are a helpful ai mentor that answer students questions based on the the the json format provided to you. Please note strictly do not answer any question beyond this skill provided to you.. please make your output clean and straightforward and even if the user going out of the topic motivates them . \n\nskill data in json - {skill}\n\nUse markdown to format your answer, properly embedding images and urls.\n\nHistory: \n\n{memory}.\n\nEnsure that:\n1. Strictly dont go to any topic than the skill json provided to you\n2. Don any json code in the output",
    "skill": "{\n  \"component\": {\n    \"description\": \"Learn the fundamentals of Express.js, including routing, middleware, and template engines.\",\n    \"document\": \"https://expressjs.com/en/guide/routing.html\",\n    \"embed_url\": \"https://www.youtube.com/embed/SccSCuHhOw0\",\n    \"name\": \"Express.js Basics\",\n    \"test_series\": [\n      {\n        \"answer\": \"To create a new route\",\n        \"options\": [\n          \"To create a new route\",\n          \"To delete an existing route\",\n          \"To update an existing route\",\n          \"To get an existing route\"\n        ],\n        \"question\": \"What is the primary use of the 'app.get' method in Express.js?\"\n      },\n      {\n        \"answer\": \"app.use is used for middleware, while app.get is used for routing\",\n        \"options\": [\n          \"app.use is used for routing, while app.get is used for middleware\",\n          \"app.use is used for middleware, while app.get is used for routing\",\n          \"app.use is used for template engines, while app.get is used for routing\",\n          \"app.use is used for routing, while app.get is used for template engines\"\n        ],\n        \"question\": \"What is the difference between 'app.use' and 'app.get' in Express.js?\"\n      },\n      {\n        \"answer\": \"To render a template engine\",\n        \"options\": [\n          \"To render a template engine\",\n          \"To send a response to the client\",\n          \"To redirect to a new route\",\n          \"To handle an error\"\n        ],\n        \"question\": \"What is the purpose of the 'res.render' method in Express.js?\"\n      }\n    ]\n  },\n  \"id\": 2,\n  \"name\": \"MERN\"\n}"
  },
  "GroqModel-lJSRC": {
         "groq_api_base": "https://api.groq.com",
            "groq_api_key": os.getenv("GROQ_API_KEY"),
            "model_name": "llama-3.1-8b-instant",
            "temperature": 0.2
  },
  "TextInput-RKP2J": {
    "input_value": session_id_component
  },
  "TextInput-PIfou": {
    "input_value": input_value
  }
  }



    result = run_flow_from_json(flow="json/AI_MENTOR.json",
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