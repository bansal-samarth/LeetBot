import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq

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

# Chat API Endpoint (Accepting Dictionary Input)
@app.post("/chat")
async def chat(request: dict):
    try:
        # Extract message safely
        user_message = request.get("message", None)
        print(user_message)

        if not user_message:
            return {"error": "Message field is required"}

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful DSA teaching assistant. Provide hints, not direct answers in very short."},
                {"role": "user", "content": user_message}
            ],
            model="llama3-8b-8192",
        )

        return {
            "status": "success",
            "user_input": user_message,
            "assistant_response": chat_completion.choices[0].message.content
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {"error": str(e)}

# Root Route
@app.get("/")
def read_root():
    return {"message": "Welcome to LEETBOT!"}