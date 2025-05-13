# 🚀 LeetBot: Intelligent Coding Mentor
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95.1+-009688.svg)
![Groq](https://img.shields.io/badge/Groq_LLama-3.0-orange.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

<p align="center">
  <img src="https://github.com/user-attachments/assets/549487ec-a41a-45e1-a68c-198b102ebcbf" alt="LeetBot Desktop View" width="700">
  <img src="https://github.com/user-attachments/assets/3cdc536a-3361-49d5-8c34-0274cea7d6f3" alt="LeetBot Mobile View" width="200">
</p>

## 🚀 Live Demo

**📱 Frontend:** [https://leetbot.vercel.app/](https://leetbot.vercel.app/)

**⚙️ Backend API:** [https://leetbot-b7uw.onrender.com](https://leetbot.onrender.com)

---

## 📚 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Setup Instructions](#-setup-instructions)
- [Educational Approach](#-educational-approach)
- [User Interaction Flow](#-user-interaction-flow)
- [Groq LLama Integration Details](#-groq-llama-integration-details)
- [Code Highlights](#-code-highlights)
- [Optimization Techniques](#-optimization-techniques)
- [Security Considerations](#-security-considerations)
- [Deployment Status](#-deployment-status)
- [License](#-license)

## 🔭 Overview

LeetBot is a sophisticated educational assistant designed to revolutionize how developers learn data structures and algorithms. Unlike conventional solutions that merely provide answers, LeetBot implements an adaptive teaching methodology that guides users through the problem-solving process with a Socratic approach.

The core philosophy behind LeetBot is "guided discovery" - empowering users to develop their algorithmic thinking and problem-solving skills through carefully structured hints, conceptual explanations, and progressive assistance. By deliberately avoiding direct solutions, LeetBot fosters deeper learning and cognitive development that translates to improved interview performance and coding proficiency.

## 🌟 Key Features

- **Progressive Hint System**: Intelligently calibrated five-level guidance framework that adapts to user understanding
- **Conceptual Reinforcement**: Identifies and explains core algorithmic concepts underlying each problem
- **Solution Analysis**: Performs complexity analysis on user-submitted solutions with optimization recommendations
- **Elegant UI/UX**: Modern, responsive interface with syntax highlighting and intuitive interaction patterns
- **Contextual Memory**: Maintains conversation history to provide coherent, continuous assistance
- **Optimization Guidance**: Helps users refine working solutions toward optimal time and space complexity
- **Edge Case Identification**: Proactively highlights corner cases and test scenarios users might overlook
- **Reactive Assistance**: Adjusts explanation depth based on detected user knowledge level

## 💻 Technology Stack

### Backend
- **FastAPI**: High-performance asynchronous framework for API development with automatic OpenAPI documentation
- **Groq**: Advanced LLM provider with unparalleled inference speed (using LLama 3 8B parameter model)
- **Pydantic**: Robust data validation and settings management
- **UUID**: Secure session management implementation

### Frontend
- **React**: Component-based UI library for building the interactive interface
- **Prismjs**: Advanced syntax highlighting for multiple programming languages
- **Lucide React**: Lightweight, customizable icon set
- **CSS3 with custom animations**: Particle effects and responsive design elements

## 🏗 System Architecture

LeetBot implements a robust client-server architecture with clear separation of concerns:

```
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│                                 │      │                                 │
│          React Frontend         │      │         FastAPI Backend         │
│                                 │      │                                 │
├─────────────────────────────────┤      ├─────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ │      │ ┌─────────────┐ ┌─────────────┐ │
│ │   UI Layer  │ │ State Mgmt  │ │      │ │ API Routes  │ │Session Store│ │
│ └─────────────┘ └─────────────┘ │◄────►│ └─────────────┘ └─────────────┘ │
│ ┌─────────────┐ ┌─────────────┐ │      │ ┌─────────────┐ ┌─────────────┐ │
│ │Code Renderer│ │ Animations  │ │      │ │Request Logic│ │ LLM Service │ │
│ └─────────────┘ └─────────────┘ │      │ └─────────────┘ └─────────────┘ │
│                                 │      │                                 │
└─────────────────────────────────┘      └──────────────┬──────────────────┘
                                                        │
                                                        ▼
                                         ┌─────────────────────────────────┐
                                         │                                 │
                                         │        Groq LLama Model         │
                                         │                                 │
                                         └─────────────────────────────────┘
```

### Key Architectural Components

1. **Frontend Components**:
   - `ChatAssistant`: Core component managing chat interface
   - `MessageFormatter`: Processes and renders messages with code highlighting
   - `InputController`: Handles user input, submission, and keyboard events
   - `SessionManager`: Maintains frontend session state and history

2. **Backend Services**:
   - `/chat` endpoint: Primary interaction portal for message exchange
   - `/history` endpoint: Retrieves and manages conversation history
   - `ConversationStore`: In-memory session and message storage
   - `PromptManager`: Constructs LLM prompts with appropriate context

3. **Cross-Cutting Concerns**:
   - CORS handling for secure cross-origin requests
   - Error handling with appropriate HTTP status codes
   - Session management with UUID generation
   - Context preservation for meaningful conversations

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Groq API key (obtain from [groq.com](https://groq.com))
- Git

### Backend Setup

1. **Clone repository and navigate to project directory**:
   ```bash
   git clone https://github.com/bansal-samarth/LeetBot.git
   cd leetbot
   ```

2. **Create and activate virtual environment**:
   ```bash
   # For Unix/macOS
   python -m venv venv
   source venv/bin/activate
   
   # For Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install fastapi uvicorn groq python-dotenv pydantic
   ```

4. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

5. **Start the FastAPI server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   The API documentation will be available at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```
   The application will be accessible at `http://localhost:3000`

4. **Build for production** (optional):
   ```bash
   npm run build
   ```

## 📚 Educational Approach

LeetBot implements a sophisticated pedagogical framework based on modern educational theory:

### 5-Level Guidance System

1. **Level 1: Clarification**
   - Asks targeted questions to understand specific confusion points
   - Helps users precisely articulate what they don't understand

2. **Level 2: Conceptual Introduction**
   - Identifies relevant DS&A concepts underlying the problem
   - Provides theoretical background without revealing solution path

3. **Level 3: Approach Guidance**
   - Offers general solution strategies
   - Presents analogous problems or simplified versions to build intuition

4. **Level 4: Algorithm Selection**
   - Guides users toward appropriate algorithmic choices
   - Discusses tradeoffs between different approaches

5. **Level 5: Implementation Assistance**
   - Provides targeted pseudocode for specific challenging sections
   - Never reveals complete working solutions

### Code Restriction Methodology

LeetBot employs strict guidelines to ensure learning efficacy:
- Maximum 5-7 lines of code in any hint
- Critical implementation details replaced with placeholder comments
- Focus on data structure design rather than implementation details
- Prioritization of pseudocode over executable code

## 🔄 User Interaction Flow

LeetBot guides users through a carefully designed interaction sequence:

1. **Problem Submission**
   - User submits LeetCode problem link
   - System analyzes problem to identify core concepts and difficulty

2. **Understanding Assessment**
   - Initial questions gauge user's specific confusion points
   - Response analysis determines appropriate guidance level

3. **Progressive Assistance**
   - System provides increasingly specific hints based on user progress
   - Each hint ends with a question to promote active engagement

4. **Solution Review**
   - User shares their implemented solution
   - System analyzes complexity and correctness
   - Optimization suggestions provided when appropriate

5. **Conceptual Reinforcement**
   - After successful solution, system connects problem to broader algorithmic principles
   - Suggests related problems that build on the same concepts

## 🧠 Groq LLama Integration Details

LeetBot leverages Groq's LLama 3 model with advanced integration techniques:

### Model Selection Rationale

The system uses `llama3-8b-8192` for several strategic reasons:
- **Optimal Parameter Size**: 8B parameters balances capability with response speed
- **Extended Context Window**: 8192 tokens enable retention of conversation history
- **Low Latency**: Groq's infrastructure provides sub-second response times
- **Cost Efficiency**: Reduced token count compared to larger models while maintaining quality

### Prompt Engineering Strategy

The system prompt employs multiple advanced techniques:
- **Role Definition**: Clear assistant identity establishment
- **Behavioral Constraints**: Explicit guidance boundaries
- **Hierarchical Instructions**: Prioritized guidance levels
- **Example-Driven Learning**: Implicit demonstrations of desired behavior
- **Boundary Reinforcement**: Strong guidance on what NOT to do

### Context Management

Effective conversation history management:
- **Selective Memory**: Retains only the most recent 100 messages to stay within context limits
- **Stateful Interactions**: Maintains user session across multiple requests
- **Coherence Preservation**: Ensures responses build on previous exchanges

## 💎 Code Highlights

### Exemplary Backend Implementation

```python
# Chat API Endpoint with robust error handling and session management
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatMessage):
    try:
        user_message = request.message
        session_id = request.session_id

        # Create or retrieve session with UUID-based identification
        if not session_id or session_id not in conversation_store:
            session_id = str(uuid.uuid4())
            conversation_store[session_id] = []
        
        # Add user message to conversation history
        conversation_store[session_id].append({"role": "user", "content": user_message})
        
        # Prepare messages with specialized system prompt
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        
        # Add conversation history (limited to prevent context overflow)
        messages.extend(conversation_store[session_id][-100:])
        
        # Execute LLM request with appropriate model selection
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192",
        )
        
        # Extract and store assistant response
        assistant_response = chat_completion.choices[0].message.content
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
```

### Frontend Code Formatting Excellence

```javascript
// Sophisticated code highlighting implementation
const formatMessageWithCode = (text) => {
  // Process code blocks with language detection
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith('```')) {
      const [language, ...code] = part.replace(/```/g, '').split('\n');
      return (
        <div key={`code-${index}`} className="code-block">
          <div className="code-header">
            <span className="code-language">{language.trim() || 'python'}</span>
            <button className="copy-button" onClick={copyCode}>Copy</button>
          </div>
          <pre><code>{code.join('\n').trim()}</code></pre>
        </div>
      );
    }
    
    // Process inline code highlighting
    const inlineParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={`text-${index}`}>
        {inlineParts.map((inlinePart, i) => {
          if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
            const codeContent = inlinePart.slice(1, -1);
            return (
              <span key={`inline-code-${i}`} className="inline-code">
                {codeContent}
              </span>
            );
          }
          return inlinePart;
        })}
      </span>
    );
  });
};
```

## ⚡ Optimization Techniques

LeetBot implements multiple performance optimizations:

1. **Frontend Optimizations**:
   - **Code Splitting**: Only loads necessary components
   - **Lazy Loading**: Defers non-critical resource loading
   - **Memoization**: Prevents unnecessary re-renders
   - **Virtual Scrolling**: Efficiently handles long conversations

2. **Backend Optimizations**:
   - **Asynchronous Request Handling**: Non-blocking I/O operations
   - **Conversation Pruning**: Prevents context window overflow
   - **Response Streaming**: Enables progressive rendering
   - **Error Boundary Implementation**: Graceful failure handling

3. **LLM Optimizations**:
   - **Precise System Prompt**: Reduces token usage
   - **Context Window Management**: Prevents information loss
   - **Model Selection**: Balances capability with performance

## 🔒 Security Considerations

LeetBot incorporates several security measures:

1. **Input Validation**: All user inputs are validated using Pydantic models
2. **CORS Configuration**: Controlled cross-origin resource sharing
3. **UUID Session IDs**: Unpredictable session identifiers
4. **Error Handling**: No leakage of sensitive implementation details
5. **Environment Variable Management**: Secure API key storage

## 🚢 Deployment Status

### Current Implementation
- ✅ Backend server successfully deployed on Render
- ✅ Frontend deployment configuration completed on Vercel
- ✅ Custom domain configuration implemented
- ⏳ Database integration for persistent storage in progress

### Monitoring and Analytics
- Performance metrics collection configured
- Error tracking implemented with detailed logging
- Usage analytics dashboard in development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <i>Built with ❤️ by Samarth Bansal</i>
</p>
