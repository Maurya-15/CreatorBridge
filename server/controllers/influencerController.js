const InfluencerProfile = require('../models/InfluencerProfile');

// @desc    Search influencers with filters
// @route   GET /api/influencers?niche=&platform=&minFollowers=
exports.searchInfluencers = async (req, res) => {
  try {
    const { niche, platform, minFollowers } = req.query;
    const filter = {};

    if (niche) filter.niche = niche;
    if (platform) filter.platform = platform;
    if (minFollowers) filter.followerCount = { $gte: Number(minFollowers) };

    const influencers = await InfluencerProfile.find(filter)
      .populate('userId', 'name email')
      .lean();

    res.json(influencers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
