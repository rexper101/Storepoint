const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { ratingValidator } = require('../validators/ratingValidators');
const { listStores } = require('../controllers/storeController');
const { submitRating } = require('../controllers/ratingController');

const router = express.Router();

router.use(authenticate, authorize('normal_user'));

router.get('/', listStores);
router.post('/:id/ratings', ratingValidator, validate, submitRating);
router.put('/:id/ratings', ratingValidator, validate, submitRating);

module.exports = router;
