import os
import redis
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel
import uuid
import json

# Load API key from .env file
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Ensure API key is loaded
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing! Please set it in the .env file.")

# Initialize Redis
redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)

# Initialize Groq Client
client = Groq(api_key=GROQ_API_KEY)

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class ChatMessage(BaseModel):
    message: str
    session_id: str = None

class ChatResponse(BaseModel):
    status: str
    user_input: str
    assistant_response: str
    session_id: str

# Fetch conversation history from Redis
def get_conversation(session_id: str):
    data = redis_client.get(session_id)
    return json.loads(data) if data else []

# Save conversation history to Redis
def save_conversation(session_id: str, conversation):
    redis_client.setex(session_id, 86400, json.dumps(conversation))  # Expire in 24 hours

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatMessage):
    try:
        user_message = request.message
        session_id = request.session_id or str(uuid.uuid4())

        # Fetch conversation history
        conversation_history = get_conversation(session_id)

        # Add user message
        conversation_history.append({"role": "user", "content": user_message})

        # Prepare messages for LLM
        messages = [{"role": "system", "content": "You're a helpful DSA assistant"}] + conversation_history[-10:]

        # Call Groq AI API
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192",
        )
        
        assistant_response = chat_completion.choices[0].message.content

        # Add assistant response
        conversation_history.append({"role": "assistant", "content": assistant_response})

        # Save updated conversation
        save_conversation(session_id, conversation_history)

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
    conversation = get_conversation(session_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"conversation": conversation}

@app.delete("/history/{session_id}")
async def clear_history(session_id: str):
    redis_client.delete(session_id)
    return {"status": "success", "message": "Conversation history cleared"}

@app.get("/")
def read_root():
    return {"message": "Welcome to LEETBOT!"}
