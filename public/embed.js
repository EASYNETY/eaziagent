(function() {
  'use strict';

  // Configuration
  const WIDGET_ID = 'ai-agent-chat-widget';
  const API_BASE_URL = window.location.origin;
  
  // Get script tag and extract configuration
  const scriptTag = document.querySelector('script[data-agent-id]');
  if (!scriptTag) {
    console.error('AI Agent Widget: No script tag with data-agent-id found');
    return;
  }

  const config = {
    agentId: scriptTag.getAttribute('data-agent-id'),
    theme: scriptTag.getAttribute('data-theme') || 'light',
    language: scriptTag.getAttribute('data-language') || 'en',
    position: scriptTag.getAttribute('data-position') || 'bottom-right'
  };

  // Check if widget already exists
  if (document.getElementById(WIDGET_ID)) {
    return;
  }

  // Generate unique session ID
  const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  // Widget state
  let isOpen = false;
  let conversationHistory = [];

  // Create widget HTML
  function createWidget() {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = WIDGET_ID;
    widgetContainer.innerHTML = `
      <div class="ai-widget-container" data-theme="${config.theme}">
        <!-- Chat Button -->
        <div class="ai-widget-button" id="ai-widget-toggle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="ai-widget-badge" id="ai-widget-badge" style="display: none;">1</div>
        </div>

        <!-- Chat Window -->
        <div class="ai-widget-window" id="ai-widget-window" style="display: none;">
          <div class="ai-widget-header">
            <div class="ai-widget-header-info">
              <div class="ai-widget-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <div class="ai-widget-agent-info">
                <div class="ai-widget-agent-name" id="ai-widget-agent-name">AI Assistant</div>
                <div class="ai-widget-status">
                  <div class="ai-widget-status-dot"></div>
                  Online
                </div>
              </div>
            </div>
            <button class="ai-widget-close" id="ai-widget-close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="ai-widget-messages" id="ai-widget-messages">
            <div class="ai-widget-message ai-widget-message-bot">
              <div class="ai-widget-message-content">
                <div class="ai-widget-message-text">Hi! How can I help you today?</div>
              </div>
            </div>
          </div>
          
          <div class="ai-widget-typing" id="ai-widget-typing" style="display: none;">
            <div class="ai-widget-typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <div class="ai-widget-input-container">
            <input type="text" class="ai-widget-input" id="ai-widget-input" placeholder="Type your message..." />
            <button class="ai-widget-send" id="ai-widget-send">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const styles = `
      <style>
        .ai-widget-container {
          position: fixed;
          ${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
          ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .ai-widget-button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          position: relative;
        }

        .ai-widget-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .ai-widget-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-widget-window {
          width: 350px;
          height: 500px;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin-bottom: 12px;
          background: ${config.theme === 'dark' ? '#1f2937' : '#ffffff'};
          border: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
        }

        .ai-widget-header {
          padding: 16px;
          background: ${config.theme === 'dark' ? '#111827' : '#f9fafb'};
          border-bottom: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ai-widget-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-widget-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-widget-agent-name {
          font-weight: 600;
          color: ${config.theme === 'dark' ? '#ffffff' : '#111827'};
          font-size: 14px;
        }

        .ai-widget-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
        }

        .ai-widget-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
        }

        .ai-widget-close {
          background: none;
          border: none;
          cursor: pointer;
          color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
          padding: 4px;
          border-radius: 4px;
        }

        .ai-widget-close:hover {
          background: ${config.theme === 'dark' ? '#374151' : '#f3f4f6'};
        }

        .ai-widget-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ai-widget-message {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .ai-widget-message-bot {
          align-self: flex-start;
        }

        .ai-widget-message-user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .ai-widget-message-content {
          max-width: 80%;
        }

        .ai-widget-message-text {
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.4;
        }

        .ai-widget-message-bot .ai-widget-message-text {
          background: ${config.theme === 'dark' ? '#374151' : '#f3f4f6'};
          color: ${config.theme === 'dark' ? '#ffffff' : '#111827'};
        }

        .ai-widget-message-user .ai-widget-message-text {
          background: #2563eb;
          color: white;
        }

        .ai-widget-typing {
          padding: 0 16px 16px;
        }

        .ai-widget-typing-indicator {
          display: flex;
          gap: 4px;
          padding: 8px 12px;
          background: ${config.theme === 'dark' ? '#374151' : '#f3f4f6'};
          border-radius: 12px;
          width: fit-content;
        }

        .ai-widget-typing-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
          animation: ai-widget-typing 1.4s infinite ease-in-out;
        }

        .ai-widget-typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .ai-widget-typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes ai-widget-typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .ai-widget-input-container {
          padding: 16px;
          border-top: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
          display: flex;
          gap: 8px;
          background: ${config.theme === 'dark' ? '#1f2937' : '#ffffff'};
        }

        .ai-widget-input {
          flex: 1;
          border: 1px solid ${config.theme === 'dark' ? '#374151' : '#d1d5db'};
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          background: ${config.theme === 'dark' ? '#374151' : '#ffffff'};
          color: ${config.theme === 'dark' ? '#ffffff' : '#111827'};
          outline: none;
        }

        .ai-widget-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .ai-widget-send {
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .ai-widget-send:hover {
          background: #1d4ed8;
        }

        .ai-widget-send:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .ai-widget-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 100px);
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.appendChild(widgetContainer);

    // Add event listeners
    setupEventListeners();
  }

  // Setup event listeners
  function setupEventListeners() {
    const toggleButton = document.getElementById('ai-widget-toggle');
    const closeButton = document.getElementById('ai-widget-close');
    const sendButton = document.getElementById('ai-widget-send');
    const input = document.getElementById('ai-widget-input');

    toggleButton.addEventListener('click', toggleWidget);
    closeButton.addEventListener('click', closeWidget);
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // Toggle widget
  function toggleWidget() {
    const window = document.getElementById('ai-widget-window');
    isOpen = !isOpen;
    window.style.display = isOpen ? 'flex' : 'none';
    
    if (isOpen) {
      document.getElementById('ai-widget-input').focus();
    }
  }

  // Close widget
  function closeWidget() {
    const window = document.getElementById('ai-widget-window');
    isOpen = false;
    window.style.display = 'none';
  }

  // Send message
  async function sendMessage() {
    const input = document.getElementById('ai-widget-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Clear input and add user message
    input.value = '';
    addMessage(message, 'user');
    
    // Show typing indicator
    showTyping();

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/${config.agentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId,
          conversationHistory: conversationHistory.slice(-10) // Keep last 10 messages
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update agent name if provided
        if (data.agentName) {
          const agentNameEl = document.getElementById('ai-widget-agent-name');
          if (agentNameEl) {
            agentNameEl.textContent = data.agentName;
          }
        }
        
        addMessage(data.response, 'bot');
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('Sorry, I\'m having trouble connecting. Please try again later.', 'bot');
    } finally {
      hideTyping();
    }
  }

  // Add message to chat
  function addMessage(text, sender) {
    const messagesContainer = document.getElementById('ai-widget-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `ai-widget-message ai-widget-message-${sender}`;
    
    messageEl.innerHTML = `
      <div class="ai-widget-message-content">
        <div class="ai-widget-message-text">${text}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Update conversation history
    conversationHistory.push({
      role: sender === 'user' ? 'user' : 'assistant',
      content: text
    });
  }

  // Show typing indicator
  function showTyping() {
    const typing = document.getElementById('ai-widget-typing');
    typing.style.display = 'block';
    
    const messagesContainer = document.getElementById('ai-widget-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Hide typing indicator
  function hideTyping() {
    const typing = document.getElementById('ai-widget-typing');
    typing.style.display = 'none';
  }

  // Initialize widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }

  // Expose global interface
  window.AIAgentWidget = {
    open: () => {
      if (!isOpen) toggleWidget();
    },
    close: closeWidget,
    sendMessage: (message) => {
      const input = document.getElementById('ai-widget-input');
      if (input) {
        input.value = message;
        sendMessage();
      }
    }
  };
})();
