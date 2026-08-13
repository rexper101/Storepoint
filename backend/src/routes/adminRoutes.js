const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createUserValidator, createStoreValidator } = require('../validators/adminValidators');
const {
  getDashboard,
  createUser,
  listUsers,
  getUserDetail,
  createStore,
  listStores,
} = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);

router.post('/users', createUserValidator, validate, createUser);
router.get('/users', listUsers);
router.get('/users/:id', getUserDetail);

router.post('/stores', createStoreValidator, validate, createStore);
router.get('/stores', listStores);

module.exports = router;
