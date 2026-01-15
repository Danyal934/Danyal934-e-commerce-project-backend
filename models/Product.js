const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  category: {
    type: String,
    default: 'General'
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  origin: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);