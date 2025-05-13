import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, ArrowDown, RotateCcw ,Github as GitHub} from 'lucide-react';
import './ChatAssistant.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Leet, your coding assistant. Share a LeetCode link, and I'll guide you through it.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // This function now includes a check to prevent scrolling outside the chat container
  const scrollToBottom = () => {
    if (messagesEndRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: messagesEndRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const copyCode = async (e) => {
    const button = e.currentTarget;
    const codeBlock = button.closest('.code-block');
    const codeContent = codeBlock.querySelector('code').textContent;
  
    try {
      await navigator.clipboard.writeText(codeContent);
      button.textContent = 'Copied!';
      button.style.backgroundColor = '#4CAF50'; // Green color feedback
      button.style.borderColor = '#4CAF50';
      
      // Reset after 1.5 seconds
      setTimeout(() => {
        button.textContent = 'Copy';
        button.style.backgroundColor = '';
        button.style.borderColor = '#FFA116';
      }, 1500);
    } catch (err) {
      console.error('Failed to copy code:', err);
      button.textContent = 'Error';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 1500);
    }
  };

  const formatMessageWithCode = (text) => {
    // Split into code blocks and regular text
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Existing code block handling
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
      
      // Process text with inline code and bold formatting
      const inlineParts = part.split(/(`[^`]+`)/g);
      return (
        <span key={`text-${index}`}>
          {inlineParts.map((inlinePart, i) => {
            if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
              // Inline code handling
              const codeContent = inlinePart.slice(1, -1);
              return (
                <span key={`inline-code-${i}`} className="inline-code">
                  {codeContent}
                </span>
              );
            }
            
            // Split and process bold text
            const boldParts = inlinePart.split(/(\*\*.*?\*\*)/g);
            return (
              <span key={`bold-${i}`}>
                {boldParts.map((boldPart, j) => {
                  if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                    const content = boldPart.slice(2, -2);
                    return (
                      <strong key={`bold-${j}`} className="bold-text">
                        {content}
                      </strong>
                    );
                  }
                  return boldPart;
                })}
              </span>
            );
          })}
        </span>
      );
    });
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const fetchBotResponse = async (userMessage) => {
    try {
      console.log('Sending request to backend:', userMessage);
      
      const requestBody = { 
        message: userMessage,
        ...(sessionId && { session_id: sessionId })
      };
      
      const response = await fetch('https://leetbot-b7uw.onrender.com/chat', {
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
    
    const userMessage = input;
    const newMessages = [...messages, { id: Date.now(), text: userMessage, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    
    setIsTyping(true);
    
    try {
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

  // Fixed handleKeyPress function
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default
      handleSend(); // Call handleSend directly
    }
  };

  const startNewProblem = async () => {
    if (sessionId) {
      try {
        await fetch(`https://leetbot-b7uw.onrender.com/history/${sessionId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        setMessages([
          { id: 1, text: "I'm ready to help with a new problem! What would you like to work on now?", sender: 'bot' }
        ]);
        setSessionId(null);
      } catch (error) {
        console.error('Error clearing conversation:', error);
      }
    } else {
      setMessages([
        { id: 1, text: "I'm ready to help with a new problem! What would you like to work on now?", sender: 'bot' }
      ]);
    }
    
    inputRef.current?.focus();
  };

  return (
    <div className="app-container">
      {/* Floating particles for relaxing animation */}
      <div className="particles-container">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="firefly"></div>
        ))}
      </div>
      
      <div className="chat-container">
        {/* Glowing circles for modern effect */}
        <div className="glow-circle glow-circle-1"></div>
        <div className="glow-circle glow-circle-2"></div>
        
        {/* Header */}
        <div className="chat-header">
          <h1 className="header-title">
            <span className="header-highlight">LEET</span>BOT
          </h1>
          <div className="header-icons">
            <a href="https://github.com/bansal-samarth" target="_blank" rel="noopener noreferrer" className="social-icon">
              <GitHub size={20} />
            </a>
            <a href="https://leetcode.com/samarthbansal" target="_blank" rel="noopener noreferrer" className="social-icon">
              <span className="leetcode-letter">L</span>
            </a>
            <a href="https://auth.geeksforgeeks.org/user/samarthbansal" target="_blank" rel="noopener noreferrer" className="social-icon">
              <span className="gfg-letter">G</span>
            </a>
          </div>
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
                  {formatMessageWithCode(message.text)}
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
              className="new-problem-button"
              onClick={startNewProblem}
              aria-label="Start new problem"
            >
              <RotateCcw size={16} />
              <span>New Chat</span>
            </button>
            
            <div className="textarea-container">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about any doubt or coding problem..."
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
    </div>
  );
}