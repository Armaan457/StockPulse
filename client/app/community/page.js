'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { api } from '../../utils/api';
import { 
  Send, 
  MessageSquare, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  ShieldAlert, 
  TrendingUp,
  Activity,
  Users
} from 'lucide-react';

export default function CommunityPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'connected' | 'disconnected'
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Set up mock online users and market tickers for premium chat aesthetics
  const activeMembers = ['AlphaTrader', 'Bullish_Ben', 'OptionSeller', 'MacroWhale', 'QuantumAlgo'];
  const marketTickers = [
    { ticker: 'SPY', price: '453.20', change: '+0.8%' },
    { ticker: 'QQQ', price: '372.15', change: '+1.2%' },
    { ticker: 'BTC', price: '64,320', change: '+4.5%' },
  ];

  useEffect(() => {
    if (user) {
      connectWebSocket();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [user]);

  if (!user) return null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const connectWebSocket = () => {
    setStatus('connecting');
    try {
      // Connect to Django Channels route
      const wsUrl = api.getWebSocketUrl('/ws/community/');
      console.log('Connecting to WebSocket URL:', wsUrl);
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        setStatus('connected');
        console.log('WebSocket Connected to Community Forum');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          let parsedPayload;
          
          try {
            // Attempt to parse our custom JSON payload structure
            parsedPayload = JSON.parse(data.message);
          } catch (e) {
            // If it's a simple string broadcasted by another client, fall back
            parsedPayload = {
              sender: 'Anonymous',
              text: data.message,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }

          setMessages((prev) => [...prev, parsedPayload]);
        } catch (e) {
          console.error('Failed to parse WebSocket message event', e);
        }
      };

      socket.onclose = () => {
        setStatus('disconnected');
        console.log('WebSocket Disconnected');
      };

      socket.onerror = (err) => {
        console.error('WebSocket Error', err);
        setStatus('disconnected');
      };

      socketRef.current = socket;
    } catch (e) {
      console.error('WebSocket Connection Failed', e);
      setStatus('disconnected');
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || status !== 'connected' || !socketRef.current) return;

    // Pack username and text inside a JSON string to pass metadata
    const payload = {
      sender: user?.username || 'Guest',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socketRef.current.send(
      JSON.stringify({
        message: JSON.stringify(payload)
      })
    );

    setInput('');
  };

  return (
    <div className="community-wrapper animate-fade-in">
      <header className="page-header">
        <div className="header-meta">
          <div>
            <h1>Community Chatroom</h1>
            <p>Share stock ideas and discuss market strategies with other investors in real-time</p>
          </div>
          
          {/* Live Status indicator */}
          <div className={`status-badge ${status}`}>
            {status === 'connected' && (
              <>
                <Wifi size={14} />
                <span>Live Feed</span>
              </>
            )}
            {status === 'connecting' && (
              <>
                <div className="dot-loading" />
                <span>Connecting...</span>
              </>
            )}
            {status === 'disconnected' && (
              <button onClick={connectWebSocket} className="reconnect-btn">
                <WifiOff size={14} />
                <span>Offline (Reconnect)</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="community-layout">
        {/* Left Column: Chat Room */}
        <div className="chat-panel glass-panel">
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="empty-chat">
                <MessageSquare size={48} className="empty-icon" />
                <h4>Welcome to the Trading Floor</h4>
                <p>Connection established. Be the first to post a market update or technical query!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isOwnMessage = msg.sender === user?.username;
                return (
                  <div key={index} className={`chat-message-row ${isOwnMessage ? 'own' : ''}`}>
                    <div className="message-header-info">
                      <span className="message-sender">{msg.sender}</span>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                    <div className="message-bubble">
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-form">
            <input
              type="text"
              placeholder={status === 'connected' ? "Type a message to share with the group..." : "Reconnecting to live server..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-input chat-input"
              disabled={status !== 'connected'}
              required
            />
            <button 
              type="submit" 
              disabled={status !== 'connected' || !input.trim()} 
              className="btn-primary send-btn"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Right Column: Tickers & Rules Info Panel */}
        <div className="forum-sidebar">
          {/* Live Market tickers */}
          <div className="sidebar-card glass-panel">
            <div className="card-title">
              <TrendingUp size={16} className="title-icon" />
              <h4>Market Index Indicators</h4>
            </div>
            <div className="index-list">
              {marketTickers.map((t) => (
                <div key={t.ticker} className="index-row">
                  <span className="index-ticker">{t.ticker}</span>
                  <span className="index-price">${t.price}</span>
                  <span className="badge-up">{t.change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active members */}
          <div className="sidebar-card glass-panel">
            <div className="card-title">
              <Users size={16} className="title-icon" />
              <h4>Active Members</h4>
            </div>
            <div className="members-list">
              <div className="member-row active-user">
                <span className="member-avatar">
                  {user?.username ? user.username.slice(0,2).toUpperCase() : 'G'}
                </span>
                <span className="member-name">{user?.username} (You)</span>
              </div>
              {activeMembers.map((m) => (
                <div key={m} className="member-row">
                  <span className="member-avatar">{m.slice(0,2).toUpperCase()}</span>
                  <span className="member-name">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div className="sidebar-card glass-panel">
            <div className="card-title">
              <ShieldAlert size={16} className="title-icon text-warning" />
              <h4>Trading Rules</h4>
            </div>
            <ul className="rules-list">
              <li>No pump-and-dump coordination.</li>
              <li>Keep analysis quantitative or sentiment-backed.</li>
              <li>Always perform personal due diligence (DYOR).</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .community-wrapper {
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

        /* Status badges */
        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .status-badge.connected {
          background: var(--success-glow);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.15);
        }

        .status-badge.connecting {
          background: rgba(245, 158, 11, 0.05);
          color: var(--warning);
          border: 1px solid rgba(245, 158, 11, 0.15);
        }

        .status-badge.disconnected {
          background: rgba(244, 63, 94, 0.1);
          color: var(--danger);
          padding: 4px;
        }

        .reconnect-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--danger);
          cursor: pointer;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 4px 12px;
        }

        .dot-loading {
          width: 8px;
          height: 8px;
          background: var(--warning);
          border-radius: 50%;
          animation: blink 1s infinite alternate;
        }

        @keyframes blink {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }

        /* Layout */
        .community-layout {
          display: grid;
          grid-template-columns: 2.5fr 1fr;
          gap: 24px;
          flex: 1;
          min-height: 0;
        }

        @media (max-width: 1024px) {
          .community-layout {
            grid-template-columns: 1fr;
          }
          .forum-sidebar {
            display: none;
          }
        }

        /* Chat panel */
        .chat-panel {
          display: flex;
          flex-direction: column;
          padding: 0;
          height: 100%;
          min-height: 480px;
          overflow: hidden;
        }

        .chat-messages {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-chat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 14px;
          color: var(--text-secondary);
          flex: 1;
          padding: 40px;
        }

        .empty-icon {
          color: var(--text-muted);
        }

        .empty-chat h4 {
          color: #fff;
          font-size: 1.15rem;
        }

        .empty-chat p {
          max-width: 320px;
          font-size: 0.9rem;
        }

        .chat-message-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 70%;
          animation: fadeInUp 0.25s ease forwards;
        }

        .chat-message-row.own {
          align-self: flex-end;
          align-items: flex-end;
        }

        .chat-message-row:not(.own) {
          align-self: flex-start;
          align-items: flex-start;
        }

        .message-header-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
        }

        .message-sender {
          font-weight: 700;
          color: var(--text-secondary);
        }

        .own .message-sender {
          color: var(--primary);
        }

        .message-time {
          color: var(--text-muted);
        }

        .message-bubble {
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 0.95rem;
          line-height: 1.45;
          word-break: break-word;
        }

        .own .message-bubble {
          background: var(--primary-glow);
          border: 1px solid var(--primary);
          color: #fff;
          border-top-right-radius: 2px;
        }

        .chat-message-row:not(.own) .message-bubble {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          color: #d1d5db;
          border-top-left-radius: 2px;
        }

        /* Input Form */
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

        /* Sidebar info cards */
        .forum-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
        }

        .sidebar-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 20px;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
        }

        .card-title h4 {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .title-icon {
          color: var(--primary);
        }

        /* Index indicators list */
        .index-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .index-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .index-ticker {
          color: #fff;
        }

        .index-price {
          color: var(--text-secondary);
        }

        /* Active members list */
        .members-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .member-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
        }

        .member-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .active-user .member-avatar {
          background: var(--primary-glow);
          border-color: var(--primary);
          color: #fff;
        }

        .member-name {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .active-user .member-name {
          color: #fff;
          font-weight: 600;
        }

        /* Guidelines */
        .rules-list {
          padding-left: 16px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rules-list li {
          line-height: 1.4;
        }

        .text-warning {
          color: var(--warning);
        }
      `}</style>
    </div>
  );
}
