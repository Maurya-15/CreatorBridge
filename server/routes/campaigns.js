const router = require('express').Router();
const {
  getAllCampaigns,
  createCampaign,
  getMyCampaigns,
  getCampaign,
  updateCampaignBrandInstagram,
} = require('../controllers/campaignController');
const { protect, roleCheck } = require('../middleware/auth');

router.get('/', protect, getAllCampaigns);
router.post('/', protect, roleCheck('brand'), createCampaign);
router.get('/brand/mine', protect, roleCheck('brand'), getMyCampaigns);
router.put('/:id/brand-instagram', protect, roleCheck('brand'), updateCampaignBrandInstagram);
router.get('/:id', protect, getCampaign);

module.exports = router;
