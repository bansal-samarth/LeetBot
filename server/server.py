import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel
import uuid
from typing import Dict, List, Optional

# Load API key from .env file
GROQ_API_KEY = "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"

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
    allow_origins=["*"],  # Allows all origins in development (restrict this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Define models for request and response
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    status: str
    user_input: str
    assistant_response: str
    session_id: str

# In-memory conversation store
# In a production app, you would use Redis or a database
conversation_store: Dict[str, List[Dict[str, str]]] = {}

# System prompt
SYSTEM_PROMPT = """
You are an expert Data Structures and Algorithms teaching assistant whose goal is to help students learn independently. Follow these guidelines:

1. NEVER provide complete solutions to problems - your role is to guide, not solve.
2. Keep responses concise (max 3-4 sentences per hint).
3. When students share a LeetCode problem link, quickly identify the core concept being tested.
4. Structure your assistance in progressive levels:
   - Level 1: Ask clarifying questions about what specifically confuses them
   - Level 2: Suggest relevant DS&A concepts to review
   - Level 3: Provide a small hint about the approach
   - Level 4: If they're still stuck, offer a slightly more specific hint about algorithm selection
   - Level 5: Only after multiple attempts, suggest pseudocode for ONE key function/step
5. Use Socratic questioning to lead students to their own insights.
6. Recognize common misconceptions in the specific problem type.
7. When appropriate, suggest simplified versions of the problem to build intuition.
8. Encourage students to verbalize their thought process and debug their own logic.
9. Remind students of edge cases they might be missing.
10. End each response with a question that prompts deeper thinking.

Remember: Your success is measured by the student's learning journey, not by giving them answers.
"""

# Chat API Endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatMessage):
    try:
        user_message = request.message
        session_id = request.session_id

        # Create or retrieve session
        if not session_id or session_id not in conversation_store:
            session_id = str(uuid.uuid4())
            conversation_store[session_id] = []
        
        # Add user message to conversation history
        conversation_store[session_id].append({"role": "user", "content": user_message})
        
        # Prepare messages for LLM
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        
        # Add conversation history (max 10 most recent messages to stay within context window)
        messages.extend(conversation_store[session_id][-10:])
        
        # Make API call
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192",
        )
        
        # Get assistant response
        assistant_response = chat_completion.choices[0].message.content
        
        # Store assistant response in conversation history
        conversation_store[session_id].append({"role": "assistant", "content": assistant_response})
        
        return {
            "status": "success",
            "user_input": user_message,
            "assistant_response": assistant_response,
            "session_id": session_id
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get conversation history
@app.get("/history/{session_id}")
async def get_history(session_id: str):
    if session_id not in conversation_store:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {"conversation": conversation_store[session_id]}

# Clear conversation history
@app.delete("/history/{session_id}")
async def clear_history(session_id: str):
    if session_id in conversation_store:
        del conversation_store[session_id]
    
    return {"status": "success", "message": "Conversation history cleared"}

# Root Route
@app.get("/")
def read_root():
    return {"message": "Welcome to LEETBOT!"}