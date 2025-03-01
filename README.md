# LeetBot

A specialized chatbot designed to help users learn data structures and algorithms by providing guided assistance with LeetCode problems.

![LeetBot Screenshot](/api/placeholder/800/450)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [How to Use LeetBot](#how-to-use-leetbot)
- [Groq LLama Integration](#groq-llama-integration)
- [Limitations](#limitations)
- [Deployment on the way](#deployment-on-the-way)
- [License](#license)
- [Contributing](#contributing)

## Overview

LeetBot is an educational assistant that helps you learn algorithms and data structures. Instead of providing complete solutions to coding problems, LeetBot guides you through the problem-solving process, offering hints and explanations when you get stuck, and helping you develop your own problem-solving skills.

## Features

- Adaptive guidance based on your level of understanding
- Progressive hints system that helps without solving problems for you
- Clean, modern UI with syntax highlighting for code snippets
- Conversation memory to continue discussions about the same problem
- Option to start fresh with a new problem at any time

## Architecture

LeetBot consists of two main components:

1. **Backend (FastAPI)**: 
   - Powers the core functionality using Groq's LLama 3 model
   - Maintains conversation history
   - Enforces teaching guidelines through a specialized system prompt

2. **Frontend (React)**:
   - Provides an intuitive chat interface
   - Handles code formatting and syntax highlighting
   - Manages user interactions and session state

### System Components

```
LeetBot
├── Backend (FastAPI)
│   ├── /chat endpoint - Main interaction point 
│   ├── /history endpoint - Retrieve conversation history
│   ├── Conversation store - In-memory session management
│   └── Groq API integration - LLM service
└── Frontend (React)
    ├── ChatAssistant component - Main UI container
    ├── Message formatting - Code highlighting and display
    └── User input handling - Sending and receiving messages
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- Groq API key (you can obtain one at [groq.com](https://groq.com))

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/leetbot.git
   cd leetbot
   ```

2. Set up a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install fastapi uvicorn groq python-dotenv pydantic
   ```

3. Create a `.env` file in the root directory and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The application should now be running at `http://localhost:3000`

## How to Use LeetBot

1. **Start a conversation** by asking about a LeetCode problem or a data structures and algorithms concept.

2. **Share a LeetCode problem link** to get specific guidance on that problem.

3. **Ask for help** when you're stuck, and LeetBot will guide you through a progressive hint system:
   - First, it will ask clarifying questions
   - Next, it will suggest relevant concepts
   - Then, it will provide small hints about the approach
   - If you're still stuck, it will offer more specific guidance

4. **Share your implementation** after you've solved the problem, and LeetBot will analyze your solution's time and space complexity.

5. **Start a new conversation** by clicking the "New Chat" button when you want to discuss a different problem.

### Example Interactions

Good questions to ask:
- "Can you help me understand this LeetCode problem? [link]"
- "I'm stuck on how to implement a binary search. What's the general approach?"
- "What's the difference between DFS and BFS for tree traversal?"
- "I've solved the problem, here's my code. Can you analyze the time complexity?"

## Groq LLama Integration

LeetBot leverages Groq's LLama 3 model (llama3-8b-8192) to provide intelligent responses. Here's how the integration works:

1. **API Initialization**: The backend initializes a Groq client using the provided API key:
   ```python
   client = Groq(api_key=GROQ_API_KEY)
   ```

2. **System Prompt**: A specialized system prompt defines LeetBot's teaching approach, instructing it to guide rather than solve problems directly:
   ```python
   SYSTEM_PROMPT = """
   You are an expert Data Structures and Algorithms teaching assistant...
   """
   ```

3. **Chat Request Processing**:
   - When a user sends a message, it's added to the conversation history
   - The backend constructs a message payload including the system prompt and conversation history
   - The payload is sent to Groq's API with the specified model

4. **Response Handling**:
   - The model's response is captured and stored in the conversation history
   - The response is returned to the frontend for display

5. **Session Management**:
   - Each conversation is assigned a unique session ID
   - Conversation history is maintained on the server, allowing for contextual responses
   - Users can clear conversation history to start fresh

### Model Configuration

The application uses the `llama3-8b-8192` model from Groq, which offers a good balance of performance and cost. It has an 8K token context window, allowing it to maintain information about the ongoing conversation.

## Limitations

- The conversation store is currently in-memory, so data is lost when the server restarts
- The application doesn't currently support file uploads or code execution
- No authentication system is implemented in this version

## Deployment on the way

### Current Status

We're making significant progress on deploying LeetBot to production environments. Here's where we stand:

- ✅ Backend server successfully deployed on Render
- ✅ Frontend deployment configuration completed on Vercel
- ⏳ Database implementation for query storage in progress

### Next Steps

1. Complete the database integration for storing user queries and conversation history
2. Finalize connection between deployed frontend and backend services
3. Implement monitoring and logging for production environment
4. Run final end-to-end testing before public release


## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
