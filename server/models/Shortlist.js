const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  influencerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Prevent duplicate shortlist entries
shortlistSchema.index({ brandId: 1, influencerId: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', shortlistSchema);
