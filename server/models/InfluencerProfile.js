const mongoose = require('mongoose');

const influencerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  bio: {
    type: String,
    default: '',
  },
  niche: {
    type: String,
    enum: ['Fashion', 'Tech', 'Food', 'Travel', 'Fitness', 'Beauty', 'Gaming'],
  },
  platform: {
    type: String,
    enum: ['Instagram', 'TikTok', 'YouTube'],
  },
  followerCount: {
    type: Number,
    default: 0,
  },
  engagementRate: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    default: '',
  },
  profileImageUrl: {
    type: String,
    default: '',
  },
  instagramUrl: {
    type: String,
    default: '',
  },
  youtubeUrl: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('InfluencerProfile', influencerProfileSchema);
