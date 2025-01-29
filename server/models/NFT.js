const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('NFT', NFTSchema);