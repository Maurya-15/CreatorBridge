const Shortlist = require('../models/Shortlist');
const InfluencerProfile = require('../models/InfluencerProfile');

// @desc    Add influencer to shortlist
// @route   POST /api/shortlist/:influencerId
exports.addToShortlist = async (req, res) => {
  try {
    const { influencerId } = req.params;

    // Check if already shortlisted
    const existing = await Shortlist.findOne({
      brandId: req.user.id,
      influencerId,
    });

    if (existing) {
      return res.status(400).json({ message: 'Already shortlisted' });
    }

    const entry = await Shortlist.create({
      brandId: req.user.id,
      influencerId,
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove influencer from shortlist
// @route   DELETE /api/shortlist/:influencerId
exports.removeFromShortlist = async (req, res) => {
  try {
    await Shortlist.findOneAndDelete({
      brandId: req.user.id,
      influencerId: req.params.influencerId,
    });

    res.json({ message: 'Removed from shortlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get brand's shortlisted influencers
// @route   GET /api/shortlist
exports.getShortlist = async (req, res) => {
  try {
    const shortlisted = await Shortlist.find({ brandId: req.user.id })
      .populate('influencerId', 'name email');

    // Attach influencer profiles
    const results = await Promise.all(
      shortlisted.map(async (entry) => {
        const profile = await InfluencerProfile.findOne({
          userId: entry.influencerId._id,
        }).lean();

        return {
          ...entry.toObject(),
          profile,
        };
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
