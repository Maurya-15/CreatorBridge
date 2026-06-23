const Application = require('../models/Application');

// @desc    Apply to a campaign
// @route   POST /api/applications
exports.apply = async (req, res) => {
  try {
    const { campaignId } = req.body;

    // Check if already applied
    const existing = await Application.findOne({
      campaignId,
      influencerId: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: 'Already applied to this campaign' });
    }

    const application = await Application.create({
      campaignId,
      influencerId: req.user.id,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get applications for a campaign
// @route   GET /api/applications/campaign/:campaignId
exports.getCampaignApplications = async (req, res) => {
  try {
    const applications = await Application.find({ campaignId: req.params.campaignId })
      .populate('influencerId', 'name email')
      .populate('campaignId', 'title');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get influencer's own applications
// @route   GET /api/applications/influencer/mine
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ influencerId: req.user.id })
      .populate('campaignId', 'title niche paymentType platform')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('influencerId', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
