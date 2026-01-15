const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }],
  context: {
    lastProductInquired: String,
    categoryInterest: String,
    conversationStage: {
      type: String,
      enum: ['greeting', 'browsing', 'product_inquiry', 'checkout_help', 'completed'],
      default: 'greeting'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
chatSchema.index({ sessionId: 1 });
chatSchema.index({ userId: 1 });
chatSchema.index({ 'context.conversationStage': 1 });
chatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 * 30 }); // Auto-delete after 30 days

module.exports = mongoose.model('ChatHistory', chatSchema);