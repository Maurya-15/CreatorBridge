const router = require('express').Router();
const {
  addToShortlist,
  removeFromShortlist,
  getShortlist,
} = require('../controllers/shortlistController');
const { protect, roleCheck } = require('../middleware/auth');

router.post('/:influencerId', protect, roleCheck('brand'), addToShortlist);
router.delete('/:influencerId', protect, roleCheck('brand'), removeFromShortlist);
router.get('/', protect, roleCheck('brand'), getShortlist);

module.exports = router;
