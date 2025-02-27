import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Mic, ArrowDown } from 'lucide-react';
import './ChatAssistant.css';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Leet, your coding assistant. How can I help you with your algorithms today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const newMessages = [...messages, { id: Date.now(), text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages([
        ...newMessages,
        { 
          id: Date.now() + 1, 
          text: `I've analyzed your code problem. Let me help you optimize the solution for: "${input}"`, 
          sender: 'bot' 
        }
      ]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h1 className="header-title">
          <span className="header-highlight">LEET</span>BOT
        </h1>
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