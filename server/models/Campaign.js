const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  niche: {
    type: String,
    enum: ['Fashion', 'Tech', 'Food', 'Travel', 'Fitness', 'Beauty', 'Gaming'],
  },
  paymentType: {
    type: String,
    enum: ['Paid', 'Gift', 'Commission'],
    required: [true, 'Payment type is required'],
  },
  budget: {
    type: Number,
  },
  platform: {
    type: String,
    enum: ['Instagram', 'TikTok', 'YouTube'],
  },
  imageUrl: {
    type: String,
    default: '',
  },
  locationRequirement: {
    type: String,
    default: 'Worldwide',
  },
  minFollowers: {
    type: Number,
    default: 0,
  },
  minEngagement: {
    type: Number,
    default: 0,
  },
  giftValue: {
    type: Number,
    default: 0,
  },
  commissionRate: {
    type: Number,
    default: 0,
  },
  brandInstagramUrl: {
    type: String,
    default: '',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Campaign', campaignSchema);
