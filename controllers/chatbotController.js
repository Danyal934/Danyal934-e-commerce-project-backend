const ChatHistory = require('../models/ChatHistory');
const Product = require('../models/Product');
const {
  PRODUCT_CATEGORIES,
  PRODUCT_KNOWLEDGE,
  SHIPPING_POLICY,
  RETURN_POLICY,
  THOR_PERSONALITY,
  extractProductName,
  getProductDetails,
  getProductOrigin,
  getCategoryProducts,
  getAllProductsOverview,
  generateQuickReplies
} = require('../utils/chatbotUtils');

// Generate session ID
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Process user message and generate response
const processMessage = async (message, sessionId, userId = null) => {
  const userMessage = message.toLowerCase().trim();
  let response = '';
  let contextUpdate = {};
  let quickReplies = [];

  // Get or create chat session
  let chatSession = await ChatHistory.findOne({ sessionId });
  if (!chatSession) {
    chatSession = await ChatHistory.create({
      sessionId,
      userId,
      messages: [],
      context: {
        conversationStage: 'greeting',
        lastProductInquired: null,
        categoryInterest: null
      }
    });
  }

  // Update context based on message
  const currentContext = chatSession.context || {};

  // Rule-based response logic with AI fallback
  if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
    const greeting = THOR_PERSONALITY.greetings[Math.floor(Math.random() * THOR_PERSONALITY.greetings.length)];
    response = greeting;
    contextUpdate.conversationStage = 'browsing';

  } else if (userMessage.includes('all products') || userMessage.includes('show products') || userMessage.includes('list products') || userMessage.includes('what do you have')) {
    response = getAllProductsOverview();
    contextUpdate.conversationStage = 'browsing';

  } else if (userMessage.includes('benefit') || userMessage.includes('health') || userMessage.includes('nutrition') || userMessage.includes('good for')) {
    const productKey = extractProductName(userMessage);
    if (productKey && PRODUCT_KNOWLEDGE[productKey]) {
      const product = PRODUCT_KNOWLEDGE[productKey];
      response = `**Health Benefits of ${product.name}:**\n\n${product.benefits}\n\nThis makes it an excellent addition to a healthy diet!`;
      contextUpdate.lastProductInquired = product.name;
    } else {
      response = "All our products offer exceptional health benefits! They are natural, minimally processed, and rich in nutrients. Which specific product would you like to know about?";
    }

  } else if (userMessage.includes('use') || userMessage.includes('how to') || userMessage.includes('recipe') || userMessage.includes('cook')) {
    const productKey = extractProductName(userMessage);
    if (productKey && PRODUCT_KNOWLEDGE[productKey]) {
      const product = PRODUCT_KNOWLEDGE[productKey];
      response = `**How to Use ${product.name}:**\n\n${product.uses}\n\nWould you like any recipe suggestions?`;
      contextUpdate.lastProductInquired = product.name;
    } else {
      response = "Each of our products has versatile culinary applications. Which product would you like usage suggestions for?";
    }

  } else if (userMessage.includes('detail') || userMessage.includes('tell me about') || userMessage.includes('information about') || userMessage.includes('what is')) {
    const productKey = extractProductName(userMessage);
    if (productKey) {
      const details = getProductDetails(productKey);
      if (details) {
        response = details;
        contextUpdate.lastProductInquired = PRODUCT_KNOWLEDGE[productKey].name;
      } else {
        response = `I apologize, but I don't have detailed information about that product. Let me show you what we have:\n\n${getAllProductsOverview()}`;
      }
    } else {
      response = getAllProductsOverview();
    }

  } else if (userMessage.includes('origin') || userMessage.includes('where from') || userMessage.includes('source') || userMessage.includes('made')) {
    const productKey = extractProductName(userMessage);
    if (productKey) {
      const originInfo = await getProductOrigin(productKey);
      if (originInfo) {
        response = originInfo;
        contextUpdate.lastProductInquired = PRODUCT_KNOWLEDGE[productKey]?.name || productKey;
      } else {
        response = `I apologize, but I could not find specific origin information. Our products are sourced from trusted global suppliers who adhere to strict quality standards.`;
      }
    } else {
      response = "WorldPantry takes pride in sourcing products from their natural origins. We work directly with farmers and producers to ensure authenticity. Which product's origin would you like to know about?";
    }

  } else if (userMessage.includes('shipping') || userMessage.includes('delivery') || userMessage.includes('ship')) {
    console.log('Shipping query detected');
    try {
      response = `Our shipping options:\n\n` +
        `* 📦 **${SHIPPING_POLICY.standard.name}**: ${SHIPPING_POLICY.standard.time} - ${SHIPPING_POLICY.standard.cost}\n` +
        `* 🚀 **${SHIPPING_POLICY.express.name}**: ${SHIPPING_POLICY.express.time} - ${SHIPPING_POLICY.express.cost}\n` +
        `* 🎉 **Free Shipping**: Available on orders over $${SHIPPING_POLICY.standard.freeThreshold}\n\n` +
        `${SHIPPING_POLICY.locations}\n\n${SHIPPING_POLICY.processing}`;
    } catch (err) {
      console.error('Error generating shipping response:', err);
      response = "Our standard shipping is 5-7 days ($4.99) and express is 2-3 days ($9.99). Free shipping over $50.";
    }

  } else if (userMessage.includes('return') || userMessage.includes('refund') || userMessage.includes('exchange')) {
    response = `Our return policy:\n\n` +
      `⏰ **Duration**: ${RETURN_POLICY.duration}\n` +
      `📦 **Condition**: ${RETURN_POLICY.condition}\n` +
      `🆓 **Free Returns**: ${RETURN_POLICY.freeReturns}\n` +
      `💰 **Refund Processing**: ${RETURN_POLICY.refundTime}\n` +
      `🚫 **Exclusions**: ${RETURN_POLICY.exclusions.join(', ')}\n` +
      `🔧 **Process**: ${RETURN_POLICY.process}`;

  } else if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('how much')) {
    const productKey = extractProductName(userMessage);
    if (productKey && PRODUCT_KNOWLEDGE[productKey]) {
      const product = PRODUCT_KNOWLEDGE[productKey];
      response = `The **${product.name}** is priced at **$${product.price}**. This premium product from ${product.origin} offers exceptional quality and value.`;
      contextUpdate.lastProductInquired = product.name;
    } else {
      response = "Our prices vary by product. Could you specify which product you're interested in? Or would you like to see all our products with prices?";
    }

  } else if (userMessage.includes('category') || userMessage.includes('type') || PRODUCT_CATEGORIES.some(cat => userMessage.includes(cat.toLowerCase()))) {
    const matchedCategory = PRODUCT_CATEGORIES.find(cat =>
      userMessage.includes(cat.toLowerCase().split(' ')[0])
    ) || PRODUCT_CATEGORIES[0];

    const categoryResponse = await getCategoryProducts(matchedCategory);
    if (categoryResponse) {
      response = categoryResponse;
      contextUpdate.categoryInterest = matchedCategory;
    } else {
      response = `We offer ${PRODUCT_CATEGORIES.join(', ')}. Each category features carefully selected natural products.`;
    }

  } else if (userMessage.includes('recommend') || userMessage.includes('suggest') || userMessage.includes('best')) {
    response = "Based on customer favorites, I highly recommend:\n\n" +
      "🏆 **Yemeni Sidr Honey** - Our premium honey with exceptional medicinal properties\n" +
      "🥇 **Saudi Ajwa Dates** - The 'Holy Date' from Medina, rich in nutrients\n" +
      "🌟 **Italian Extra Virgin Olive Oil** - Gold-standard from Tuscany\n\n" +
      "Would you like detailed information about any of these?";

  } else if (userMessage.includes('thank') || userMessage.includes('thanks')) {
    const closing = THOR_PERSONALITY.closings[Math.floor(Math.random() * THOR_PERSONALITY.closings.length)];
    response = closing;
    contextUpdate.conversationStage = 'completed';

  } else if (userMessage.includes('help') || userMessage.includes('support')) {
    response = "I can assist you with:\n\n" +
      "📦 Product information (details, benefits, uses)\n" +
      "🌍 Product origins and sourcing\n" +
      "🚚 Shipping and delivery policies\n" +
      "↩️ Returns and refunds\n" +
      "💰 Pricing information\n" +
      "⭐ Product recommendations\n\n" +
      "What would you like to know?";

  } else {
    // Check if message contains any product keyword
    const productKey = extractProductName(userMessage);
    if (productKey) {
      const details = getProductDetails(productKey);
      if (details) {
        response = details;
        contextUpdate.lastProductInquired = PRODUCT_KNOWLEDGE[productKey].name;
      } else {
        response = "Thank you for your inquiry. As your WorldPantry assistant, I specialize in product information, shipping details, and origin transparency. Could you please clarify your question so I may provide the most accurate assistance?";
      }
    } else {
      response = "Thank you for your inquiry. As your WorldPantry assistant, I can help you with:\n\n" +
        "• Product details and benefits\n" +
        "• Shipping and returns\n" +
        "• Product recommendations\n\n" +
        "What would you like to know?";
    }
  }

  // Update chat session
  const updatedContext = { ...currentContext, ...contextUpdate };
  await ChatHistory.findByIdAndUpdate(chatSession._id, {
    $push: {
      messages: {
        sender: 'user',
        message: userMessage,
        timestamp: new Date()
      }
    },
    context: updatedContext
  });

  // Add bot response to history
  await ChatHistory.findByIdAndUpdate(chatSession._id, {
    $push: {
      messages: {
        sender: 'bot',
        message: response,
        timestamp: new Date(),
        metadata: { context: updatedContext }
      }
    }
  });

  // Generate quick replies based on updated context
  quickReplies = generateQuickReplies(updatedContext);

  return {
    response,
    quickReplies,
    sessionId,
    context: updatedContext
  };
};

// Get chat history
const getChatHistory = async (sessionId) => {
  const chatSession = await ChatHistory.findOne({ sessionId });
  if (!chatSession) {
    return { messages: [], sessionId };
  }
  return {
    messages: chatSession.messages,
    sessionId: chatSession.sessionId,
    context: chatSession.context
  };
};

// Initialize chat session
const initializeChat = async (userId = null) => {
  const sessionId = generateSessionId();
  const greeting = THOR_PERSONALITY.greetings[Math.floor(Math.random() * THOR_PERSONALITY.greetings.length)];

  const chatSession = await ChatHistory.create({
    sessionId,
    userId,
    messages: [{
      sender: 'bot',
      message: greeting,
      timestamp: new Date()
    }],
    context: {
      conversationStage: 'greeting',
      lastProductInquired: null,
      categoryInterest: null
    }
  });

  return {
    sessionId,
    greeting,
    quickReplies: generateQuickReplies(chatSession.context)
  };
};

module.exports = {
  processMessage,
  getChatHistory,
  initializeChat
};