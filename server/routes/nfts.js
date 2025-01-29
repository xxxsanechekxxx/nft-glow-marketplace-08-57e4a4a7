const express = require('express');
const router = express.Router();
const NFT = require('../models/NFT');

// Get all NFTs with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const nfts = await NFT.find()
      .skip(skip)
      .limit(limit);

    const total = await NFT.countDocuments();
    const hasMore = skip + nfts.length < total;

    res.json({
      nfts,
      hasMore,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single NFT
router.get('/:id', async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }
    res.json(nft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create NFT
router.post('/', async (req, res) => {
  const nft = new NFT({
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    creator: req.body.creator,
    endTime: req.body.endTime
  });

  try {
    const newNFT = await nft.save();
    res.status(201).json(newNFT);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;