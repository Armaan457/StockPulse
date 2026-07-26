'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../AuthProvider';
import Markdown from '../components/Markdown';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  Activity, 
  Trash2,
  HelpCircle
} from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your StockPulse AI Advisor. Ask me anything about stock data, market trends, portfolio strategies, or analysis. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  if (!user) return null;

  const prompts = [
    'How do I build a diversified portfolio?',
    'What are the risk factors of Apple (AAPL)?',
    'Explain the difference between quantitative and sentiment analysis.',
    'Is a speculative risk profile suited for long term growth?'
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e, customText = '') => {
    if (e) e.preventDefault();
    const queryText = (customText || input).trim();
    if (!queryText || loading) return;

    setInput('');
    // Append user message
    const updatedMessages = [...messages, { role: 'user', content: queryText }];
    setMessages(updatedMessages);
    
    setLoading(true);
    try {
      // Map message history to backend format
      const history = updatedMessages
        .slice(0, -1) // Exclude current query
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await api.chatBot(queryText, history);
      setMessages([...updatedMessages, { role: 'assistant', content: response.answer }]);
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error connecting to the AI agent. Please try again in a moment.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat history cleared. How can I assist you with your investments today?'
      }
    ]);
  };

  return (
    <div className="chat-wrapper animate-fade-in">
      <header className="page-header">
        <div className="header-meta">
          <div>
            <h1>AI Market Assistant</h1>
            <p>Converse with a financial advisor agent trained to parse technical and news data</p>
          </div>
          <button onClick={handleClearChat} className="btn-secondary clear-btn" title="Clear History">
            <Trash2 size={16} />
            <span>Clear Chat</span>
          </button>
        </div>
      </header>

      <div className="chat-container-layout">
        {/* Main Conversation Window */}
        <div className="chat-window glass-panel">
          <div className="messages-area">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                <div className="avatar-wrapper">
                  {msg.role === 'assistant' ? (
                    <Bot size={16} className="bot-icon" />
                  ) : (
                    <User size={16} className="user-icon" />
                  )}
                </div>
                <div className="message-bubble">
                  <div className="message-text">
                    <Markdown text={msg.content} />
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message-row assistant typing">
                <div className="avatar-wrapper">
                  <Bot size={16} className="bot-icon pulse-icon" />
                </div>
                <div className="message-bubble">
                  <div className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Form */}
          <form onSubmit={(e) => handleSend(e)} className="chat-input-form">
            <input
              type="text"
              placeholder="Ask about ticker forecasts, market indicators, portfolio strategy..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-input chat-input"
              disabled={loading}
              required
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary send-btn">
              {loading ? (
                <Loader2 size={18} className="spinner" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>

        {/* Sidebar suggestions */}
        <div className="suggestions-panel glass-panel">
          <div className="suggestions-header">
            <HelpCircle size={18} className="help-icon" />
            <h3>Suggested Queries</h3>
          </div>
          <p className="desc">Click any preset to consult the AI assistant:</p>
          <div className="suggestions-list">
            {prompts.map((p, idx) => (
              <button 
                key={idx} 
                onClick={() => handleSend(null, p)}
                disabled={loading}
                className="suggestion-item"
              >
                <span>{p}</span>
                <Sparkles size={14} className="sparkle-icon" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .chat-wrapper {
          display: flex;
          flex-direction: column;
          gap: 30px;
          height: calc(100vh - 80px);
        }

        .page-header h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 6px;
        }

        .page-header p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .header-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .clear-btn {
          height: 38px;
          padding: 0 16px;
          font-size: 0.85rem;
          gap: 6px;
          border-color: rgba(244, 63, 94, 0.2);
          color: rgba(244, 63, 94, 0.8);
        }

        .clear-btn:hover {
          background: rgba(244, 63, 94, 0.05);
          color: var(--danger);
        }

        .chat-container-layout {
          display: grid;
          grid-template-columns: 2.5fr 1fr;
          gap: 24px;
          flex: 1;
          min-height: 0; /* Important for flex/overflow scroll */
        }

        @media (max-width: 1024px) {
          .chat-container-layout {
            grid-template-columns: 1fr;
          }
          .suggestions-panel {
            display: none;
          }
        }

        /* Chat Window */
        .chat-window {
          display: flex;
          flex-direction: column;
          padding: 0;
          height: 100%;
          min-height: 480px;
          overflow: hidden;
        }

        .messages-area {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .message-row {
          display: flex;
          gap: 14px;
          max-width: 75%;
          animation: fadeInUp 0.3s ease forwards;
        }

        .message-row.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-row.assistant {
          align-self: flex-start;
        }

        .avatar-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user .avatar-wrapper {
          background: var(--primary-glow);
          border: 1px solid var(--primary);
          color: #fff;
        }

        .assistant .avatar-wrapper {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          color: var(--primary);
          box-shadow: 0 0 10px rgba(79, 70, 229, 0.1);
        }

        .pulse-icon {
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .message-bubble {
          padding: 14px 18px;
          border-radius: 14px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .user .message-bubble {
          background: var(--primary);
          color: #fff;
          border-top-right-radius: 2px;
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .assistant .message-bubble {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          color: #e5e7eb;
          border-top-left-radius: 2px;
        }

        .message-text {
          white-space: pre-wrap;
        }

        /* Typing Dots */
        .typing-dots {
          display: flex;
          gap: 6px;
          padding: 4px 0;
          align-items: center;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: typeBounce 1.4s infinite ease-in-out both;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typeBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* Chat Form */
        .chat-input-form {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid var(--border);
          background: rgba(0, 0, 0, 0.15);
        }

        .chat-input {
          height: 48px;
          background: rgba(255, 255, 255, 0.02);
        }

        .send-btn {
          width: 48px;
          height: 48px;
          padding: 0;
          flex-shrink: 0;
          border-radius: 8px;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Suggestions Panel */
        .suggestions-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: fit-content;
        }

        .suggestions-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
        }

        .suggestions-header h3 {
          font-size: 1.15rem;
          font-weight: 700;
        }

        .help-icon {
          color: var(--primary);
        }

        .suggestions-panel .desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: -6px;
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .suggestion-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          text-align: left;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .suggestion-item:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.12);
          color: #fff;
          transform: translateY(-1px);
        }

        .suggestion-item:hover .sparkle-icon {
          color: var(--warning);
          filter: drop-shadow(0 0 4px var(--warning));
        }

        .sparkle-icon {
          color: var(--text-muted);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
