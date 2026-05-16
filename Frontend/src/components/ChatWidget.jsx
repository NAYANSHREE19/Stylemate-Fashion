import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, User } from 'lucide-react';
import { chatWithStylist } from '../services/chatbotService';
import { useAuth } from '../context/AuthContext';
import './ChatWidget.css';

const SUGGESTIONS = [
  "What should I wear for a date night?",
  "Help me pick an outfit for work",
  "What goes well with my blue jeans?",
  "I need a casual weekend look",
];

const ChatWidget = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hey! I'm your AI Stylist 👋 I know your wardrobe inside out. Ask me anything about what to wear!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isAuthenticated) return null;

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build history for multi-turn (exclude first system msg)
      const history = messages
        .filter((_, i) => i > 0)
        .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', text: m.text }));

      const response = await chatWithStylist(messageText, history);

      if (response.success && response.reply) {
        setMessages(prev => [...prev, { role: 'assistant', text: response.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't process that. Try again!" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Oops, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        className={`chat-fab ${isOpen ? 'chat-fab--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Stylist Chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header__avatar">
              <Sparkles size={18} />
            </div>
            <div className="chat-header__info">
              <h4>AI Stylist</h4>
              <span>Knows your wardrobe</span>
            </div>
            <button className="chat-header__close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                <div className="chat-msg__avatar">
                  {msg.role === 'assistant' ? <Sparkles size={14} /> : <User size={14} />}
                </div>
                <div className="chat-msg__bubble">
                  {msg.text.split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg chat-msg--assistant">
                <div className="chat-msg__avatar"><Sparkles size={14} /></div>
                <div className="chat-msg__bubble chat-msg__typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (only show when few messages) */}
          {messages.length <= 2 && !loading && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="chat-suggestion-chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-area">
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              placeholder="Ask your stylist..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              {loading ? <Loader2 size={18} className="spin-icon" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
