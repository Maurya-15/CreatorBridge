const router = require('express').Router();
const {
  apply,
  getCampaignApplications,
  getMyApplications,
  updateStatus,
} = require('../controllers/applicationController');
const { protect, roleCheck } = require('../middleware/auth');

router.post('/', protect, roleCheck('influencer'), apply);
router.get('/campaign/:campaignId', protect, roleCheck('brand'), getCampaignApplications);
router.get('/influencer/mine', protect, roleCheck('influencer'), getMyApplications);
router.put('/:id/status', protect, roleCheck('brand'), updateStatus);

module.exports = router;
