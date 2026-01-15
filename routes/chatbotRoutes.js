const express = require('express');
const router = express.Router();
const { processMessage, getChatHistory, initializeChat } = require('../controllers/chatbotController');

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Chatbot API is working!',
    timestamp: new Date().toISOString(),
    status: 'active'
  });
});

// @desc    Initialize new chat session
// @route   POST /api/chatbot/init
// @access  Public
router.post('/init', async (req, res) => {
  try {
    const { userId } = req.body;
    const chatSession = await initializeChat(userId);
    res.json(chatSession);
  } catch (error) {
    console.error('Error initializing chat:', error);
    res.status(500).json({ 
      message: 'Failed to initialize chat session',
      fallback: true,
      sessionId: 'fallback_' + Date.now(),
      greeting: "Hello! I'm Thor, your WorldPantry assistant."
    });
  }
});

// @desc    Process user message
// @route   POST /api/chatbot/message
// @access  Public
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({ 
        message: 'Message and sessionId are required',
        fallback: true,
        response: "I need a message to respond to. Please try again."
      });
    }
    
    const result = await processMessage(message, sessionId, userId);
    res.json(result);
    
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ 
      message: 'Failed to process message',
      fallback: true,
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
      sessionId: req.body.sessionId || 'fallback_session'
    });
  }
});

// @desc    Get chat history
// @route   GET /api/chatbot/history/:sessionId
// @access  Public
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await getChatHistory(sessionId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ 
      message: 'Failed to fetch chat history',
      sessionId: req.params.sessionId
    });
  }
});

module.exports = router;