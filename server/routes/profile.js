const router = require('express').Router();
const { getProfile, createProfile, updateProfile } = require('../controllers/profileController');
const { protect, roleCheck } = require('../middleware/auth');

router.get('/:userId', protect, getProfile);
router.post('/', protect, roleCheck('influencer'), createProfile);
router.put('/', protect, roleCheck('influencer'), updateProfile);

module.exports = router;
