import os
import json
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel
from typing import Dict, List, Optional

# Load API key from .env file
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Ensure API key is loaded
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing! Please set it in the .env file.")

# Initialize Groq Client
client = Groq(api_key=GROQ_API_KEY)

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File path to store chat sessions
CHAT_HISTORY_FILE = "chat_sessions.json"

# Ensure the file exists
if not os.path.exists(CHAT_HISTORY_FILE):
    with open(CHAT_HISTORY_FILE, "w") as f:
        json.dump({}, f)

# Load conversation history from file
def load_conversations():
    try:
        with open(CHAT_HISTORY_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}

# Save conversation history to file
def save_conversations(conversations):
    with open(CHAT_HISTORY_FILE, "w") as f:
        json.dump(conversations, f)

# Load existing conversations on startup
conversation_store = load_conversations()

# Define models for request and response
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    status: str
    user_input: str
    assistant_response: str
    session_id: str

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatMessage):
    try:
        user_message = request.message
        session_id = request.session_id or str(uuid.uuid4())

        # Retrieve session history
        if session_id not in conversation_store:
            conversation_store[session_id] = []

        # Append user message
        conversation_store[session_id].append({"role": "user", "content": user_message})

        # Keep only the last 10 messages for context
        messages = [{"role": "system", "content": "You're a helpful DSA assistant"}] + conversation_store[session_id][-10:]

        # Call Groq API
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192",
        )
        
        assistant_response = chat_completion.choices[0].message.content

        # Append assistant response
        conversation_store[session_id].append({"role": "assistant", "content": assistant_response})

        # Save conversation to file
        save_conversations(conversation_store)

        return {
            "status": "success",
            "user_input": user_message,
            "assistant_response": assistant_response,
            "session_id": session_id
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{session_id}")
async def get_history(session_id: str):
    if session_id not in conversation_store:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"conversation": conversation_store[session_id]}

@app.delete("/history/{session_id}")
async def clear_history(session_id: str):
    if session_id in conversation_store:
        del conversation_store[session_id]
        save_conversations(conversation_store)
    return {"status": "success", "message": "Conversation history cleared"}

@app.get("/")
def read_root():
    return {"message": "Welcome to LEETBOT!"}
