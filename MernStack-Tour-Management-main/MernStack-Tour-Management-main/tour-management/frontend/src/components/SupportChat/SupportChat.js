import React, { useState, useEffect, useRef } from 'react';
import './SupportChat.css';

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [showCategories, setShowCategories] = useState(true);
  const messagesEndRef = useRef(null);

  const categories = [
    { id: 'general', name: 'General', icon: '💬' },
    { id: 'booking', name: 'Booking Help', icon: '🎫' },
    { id: 'payment', name: 'Payment Issues', icon: '💳' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' },
    { id: 'refund', name: 'Refund & Cancellation', icon: '↩️' }
  ];

  const quickReplies = [
    'Track my order',
    'Payment failed',
    'Cancel booking',
    'Refund status',
    'Change tour date',
    'Contact guide'
  ];

  const botResponses = {
    general: [
      "Hello! How can I help you today?",
      "I'm here to assist you with any questions about our tours.",
      "Is there anything specific you'd like to know about our services?"
    ],
    booking: [
      "I can help you with booking-related questions.",
      "Would you like to check your booking status or make changes to an existing booking?",
      "I can assist with new bookings, modifications, and cancellations."
    ],
    payment: [
      "I understand you're having payment issues. Let me help you resolve this.",
      "Common payment issues include card declines, insufficient funds, or technical glitches.",
      "Would you like to try an alternative payment method or check your wallet balance?"
    ],
    technical: [
      "I'm here to help with technical issues you're experiencing.",
      "Are you having trouble with the website, mobile app, or booking system?",
      "Let me know what specific issue you're facing and I'll assist you."
    ],
    refund: [
      "I can help you with refund and cancellation inquiries.",
      "Our refund policy depends on the cancellation timing and tour type.",
      "Would you like to know about your refund status or initiate a cancellation?"
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Add welcome message
      setTimeout(() => {
        addBotMessage("Hello! Welcome to Tour Management Support. How can I assist you today?");
      }, 500);
    }
  };

  const addBotMessage = (message) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: message,
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (message) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }]);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategories(false);
    const responses = botResponses[category] || botResponses.general;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addBotMessage(randomResponse);
  };

  const handleQuickReply = (reply) => {
    addUserMessage(reply);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      handleBotResponse(reply);
    }, 1000 + Math.random() * 1000);
  };

  const handleBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('track') || lowerMessage.includes('order')) {
      addBotMessage("To track your order, please provide your booking ID. You can find it in your confirmation email.");
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('failed')) {
      addBotMessage("I understand you're having payment issues. This could be due to insufficient funds, card limits, or technical issues. Would you like to try using your wallet balance or a different payment method?");
    } else if (lowerMessage.includes('cancel')) {
      addBotMessage("I can help you with cancellation. Please note that cancellation policies vary by tour type and timing. What's your booking ID?");
    } else if (lowerMessage.includes('refund')) {
      addBotMessage("Refund processing typically takes 5-7 business days. The amount will be credited to your original payment method or wallet. Can I help you check your refund status?");
    } else if (lowerMessage.includes('guide') || lowerMessage.includes('contact')) {
      addBotMessage("Your tour guide's contact information will be available 24 hours before your tour starts in the booking details. You can also reach our 24/7 support at +1-800-TOUR-HELP.");
    } else {
      const responses = [
        "I understand. Let me help you with that. Could you provide more details?",
        "I'm here to help. Could you please elaborate on your concern?",
        "Thank you for reaching out. How can I assist you further with this issue?"
      ];
      addBotMessage(responses[Math.floor(Math.random() * responses.length)]);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    addUserMessage(inputMessage);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      handleBotResponse(inputMessage);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`support-chat ${isOpen ? 'open' : ''}`}>
      <div className="chat-widget" onClick={toggleChat}>
        <div className="chat-icon">
          {isOpen ? '✕' : '💬'}
        </div>
        {!isOpen && (
          <div className="chat-badge">
            <span>Need Help?</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <div className="header-info">
              <h3>Customer Support</h3>
              <span className="status">Online</span>
            </div>
            <button className="close-btn" onClick={toggleChat}>
              ✕
            </button>
          </div>

          {showCategories && (
            <div className="category-selection">
              <h4>How can I help you?</h4>
              <div className="categories">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className="category-btn"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chat-messages">
            {messages.map(message => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {!showCategories && (
            <div className="quick-replies">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
            />
            <button 
              className="send-btn"
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === ''}
            >
              ➤
            </button>
          </div>

          <div className="chat-footer">
            <small>
              Powered by Tour Management AI • Response time: ~1-2 seconds
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChat;
