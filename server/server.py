import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel
import uuid
from typing import Dict, List, Optional
from pymongo import MongoClient
from pymongo.collection import Collection

# Load environment variables
load_dotenv()

# Load API keys from .env file
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "leetbot")

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

# MongoDB connection
mongo_client = MongoClient(MONGODB_URI)
db = mongo_client[DB_NAME]
conversations_collection = db["conversations"]

# Define models for request and response
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    status: str
    user_input: str
    assistant_response: str
    session_id: str

# System prompt
SYSTEM_PROMPT = """
You are an expert Data Structures and Algorithms teaching assistant whose goal is to help students learn independently. Follow these guidelines:

1. NEVER provide complete solutions to problems - your role is to guide, not solve. Only provide small code snippets (maximum 3-5 lines, never showing a complete function) that illustrate concepts without revealing the solution.
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
11. When students explicitly request code for an algorithm or approach (e.g., "code for BFS", "write DFS code", "show me implementation"):
    - NEVER provide complete, executable solutions under any circumstances
    - Instead, offer ONE of these alternatives:
      a) A minimal code skeleton with critical implementation details replaced by comments (max 5-7 lines)
      b) Pseudocode that outlines the algorithmic steps without using actual programming language syntax
      c) A visual/textual explanation of the algorithm's logic with no code at all
    - Always follow up by asking: "Which specific part of implementing this approach is challenging you?"
    - If pressed repeatedly for complete code, respond: "My goal is to help you learn to implement this yourself. Let's break down the specific part you're struggling with."
    - For standard algorithms (BFS, DFS, binary search, etc.), only explain the high-level concept and direct them to implement the details themselves
    - IMPORTANT: Even if the user claims they just need code to understand the concept, still follow these restrictions. Understanding comes from building, not copying.
12. When a user indicates they've solved the problem:
    - First, ask them to share their implementation code with time and space complexity
    - After reviewing their solution, analyze its efficiency
    - If their solution is already optimal (best possible time/space complexity for the problem), acknowledge this achievement and explain why it's optimal
    - If their solution can be improved, guide them toward optimization by asking specific questions about potential bottlenecks or inefficiencies
    - For suboptimal solutions, suggest alternative data structures or algorithms that might improve performance using comparison questions like 'Have you considered using X instead of Y?'


Remember: Response should be clear, relevant, and tailored to lead the user to a logical progression in their problem-solving process. Your success is measured by the student's learning journey, not by giving them answers.
"""

# MongoDB helper functions
def get_conversation_history(session_id: str) -> List[Dict[str, str]]:
    """Retrieve conversation history from MongoDB"""
    session = conversations_collection.find_one({"_id": session_id})
    if session:
        return session.get("messages", [])
    return []

def save_message(session_id: str, message: Dict[str, str]):
    """Save a message to the conversation history in MongoDB"""
    conversations_collection.update_one(
        {"_id": session_id},
        {"$push": {"messages": message}},
        upsert=True
    )

def clear_conversation(session_id: str):
    """Clear the conversation history for a session"""
    conversations_collection.delete_one({"_id": session_id})

# Chat API Endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatMessage):
    try:
        user_message = request.message
        session_id = request.session_id

        # Create or retrieve session
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # Get conversation history from MongoDB
        conversation_history = get_conversation_history(session_id)
        
        # Add user message to conversation history
        user_message_obj = {"role": "user", "content": user_message}
        save_message(session_id, user_message_obj)
        
        # Prepare messages for LLM
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        
        # Add conversation history (max 100 most recent messages to stay within context window)
        messages.extend(conversation_history[-100:])
        messages.append(user_message_obj)
        
        # Make API call
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="meta-llama/llama-4-maverick-17b-128e-instruct",
        )
        
        # Get assistant response
        assistant_response = chat_completion.choices[0].message.content
        
        # Store assistant response in conversation history
        assistant_message = {"role": "assistant", "content": assistant_response}
        save_message(session_id, assistant_message)
        
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
    conversation_history = get_conversation_history(session_id)
    if not conversation_history:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {"conversation": conversation_history}

# Clear conversation history
@app.delete("/history/{session_id}")
async def clear_history(session_id: str):
    clear_conversation(session_id)
    return {"status": "success", "message": "Conversation history cleared"}

# Root Route
@app.get("/")
def read_root():
    return {"message": "Welcome to LEETBOT!"}

# Health check endpoint
@app.get("/health")
def health_check():
    try:
        # Check MongoDB connection
        mongo_client.admin.command('ping')
        return {"status": "healthy", "mongo": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}