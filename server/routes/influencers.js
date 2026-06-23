const router = require('express').Router();
const { searchInfluencers } = require('../controllers/influencerController');
const { protect } = require('../middleware/auth');

router.get('/', protect, searchInfluencers);

module.exports = router;
