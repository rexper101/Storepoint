const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { getDashboard } = require('../controllers/storeOwnerController');

const router = express.Router();

router.use(authenticate, authorize('store_owner'));

router.get('/dashboard', getDashboard);

module.exports = router;
