const Campaign = require('../models/Campaign');

// @desc    Get all campaigns
// @route   GET /api/campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('brandId', 'name')
      .sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a campaign
// @route   POST /api/campaigns
exports.createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create({
      brandId: req.user.id,
      ...req.body,
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get brand's own campaigns
// @route   GET /api/campaigns/brand/mine
exports.getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ brandId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update campaign brand Instagram URL
// @route   PUT /api/campaigns/:id/brand-instagram
exports.updateCampaignBrandInstagram = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.brandId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this campaign' });
    }

    campaign.brandInstagramUrl = req.body.brandInstagramUrl?.trim() || '';
    await campaign.save();

    const updated = await Campaign.findById(campaign._id).populate('brandId', 'name email');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('brandId', 'name email');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
