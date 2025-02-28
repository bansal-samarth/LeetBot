import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Mic, ArrowDown } from 'lucide-react';
import './ChatAssistant.css';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Leet, your coding assistant. How can I help you with your algorithms today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null); // New state for session ID
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const fetchBotResponse = async (userMessage) => {
    try {
      console.log('Sending request to backend:', userMessage);
      
      // Include session ID if available
      const requestBody = { 
        message: userMessage,
        ...(sessionId && { session_id: sessionId })
      };
      
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
        mode: 'cors',
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Store session ID from response if it exists
      if (data.session_id) {
        setSessionId(data.session_id);
        console.log('Session ID set:', data.session_id);
      }
      
      return data.assistant_response;
    } catch (error) {
      console.error('Error fetching response:', error);
      return `Sorry, I encountered an error. Please check the console for details.`;
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = input;
    const newMessages = [...messages, { id: Date.now(), text: userMessage, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Get actual response from backend
      const botResponse = await fetchBotResponse(userMessage);
      
      setIsTyping(false);
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          id: Date.now() + 1, 
          text: botResponse, 
          sender: 'bot' 
        }
      ]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          id: Date.now() + 1, 
          text: "Sorry, I couldn't process your request at the moment. Please try again.", 
          sender: 'bot' 
        }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Add function to clear conversation
  const clearConversation = async () => {
    if (sessionId) {
      try {
        await fetch(`http://localhost:8000/history/${sessionId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Reset UI
        setMessages([
          { id: 1, text: "Hello! I'm Leet, your coding assistant. How can I help you with your algorithms today?", sender: 'bot' }
        ]);
        setSessionId(null);
      } catch (error) {
        console.error('Error clearing conversation:', error);
      }
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h1 className="header-title">
          <span className="header-highlight">LEET</span>BOT
        </h1>
        {/* Optional: Add reset button */}
        {sessionId && (
          <button 
            onClick={clearConversation} 
            className="reset-button"
            aria-label="Clear conversation"
          >
            Clear Chat
          </button>
        )}
      </div>
      
      {/* Chat messages */}
      <div ref={chatContainerRef} className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-row ${message.sender === 'user' ? 'message-row-user' : 'message-row-bot'}`}>
            <div className={`message-bubble ${message.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
              <div className="message-header">
                {message.sender === 'bot' ? (
                  <Bot size={18} />
                ) : (
                  <User size={18} />
                )}
                <span className="message-sender">
                  {message.sender === 'bot' ? 'Leet' : 'You'}
                </span>
              </div>
              <p className="message-text">
                {message.text}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message-row message-row-bot">
            <div className="message-bubble bot-bubble">
              <div className="typing-indicator">
                <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
                <div className="typing-dot" style={{ animationDelay: '150ms' }}></div>
                <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="input-container">
        <div className="input-wrapper">
          <button 
            className="icon-button"
            aria-label="Voice input"
          >
            <Mic size={22} />
          </button>
          
          <div className="textarea-container">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about any algorithm or coding problem..."
              className="chat-textarea"
              rows="1"
            />
            
            <button 
              className="scroll-button"
              onClick={scrollToBottom}
              aria-label="Scroll to bottom"
            >
              <ArrowDown size={18} />
            </button>
          </div>
          
          <button 
            onClick={handleSend}
            disabled={input.trim() === ''}
            className={`send-button ${input.trim() === '' ? 'send-button-disabled' : ''}`}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}