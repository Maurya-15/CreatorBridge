const InfluencerProfile = require('../models/InfluencerProfile');

// @desc    Get influencer profile by userId
// @route   GET /api/profile/:userId
exports.getProfile = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ userId: req.params.userId })
      .populate('userId', 'name email');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create influencer profile
// @route   POST /api/profile
exports.createProfile = async (req, res) => {
  try {
    // Check if profile already exists
    const existing = await InfluencerProfile.findOne({ userId: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists. Use PUT to update.' });
    }

    const profile = await InfluencerProfile.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update influencer profile
// @route   PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Create one first.' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
