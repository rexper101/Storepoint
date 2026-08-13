const { fn, col } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { buildLikeFilters, buildOrder } = require('../utils/queryHelpers');

async function getDashboard(req, res, next) {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { name, email, password, address, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const user = await User.create({ name, email, password, address, role });
    res.status(201).json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const where = buildLikeFilters(req.query, ['name', 'email', 'address']);
    if (req.query.role) where.role = req.query.role;

    const order = buildOrder(req.query, ['name', 'email', 'role', 'createdAt'], 'name');

    const users = await User.findAll({
      where,
      order,
      attributes: { exclude: ['password'] },
    });
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

async function getUserDetail(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const result = user.toJSON();

    if (user.role === 'store_owner') {
      const store = await Store.findOne({ where: { ownerId: user.id } });
      if (store) {
        const avg = await Rating.findOne({
          where: { storeId: store.id },
          attributes: [[fn('AVG', col('rating')), 'avgRating']],
          raw: true,
        });
        result.rating = avg.avgRating ? Number(avg.avgRating).toFixed(2) : null;
      } else {
        result.rating = null;
      }
    }

    res.json({ user: result });
  } catch (err) {
    next(err);
  }
}

async function createStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;

    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(400).json({ message: 'ownerId does not match an existing user' });
      }
      if (owner.role !== 'store_owner') {
        return res
          .status(400)
          .json({ message: 'Owner must be a user with the store_owner role' });
      }
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
}

async function listStores(req, res, next) {
  try {
    const where = buildLikeFilters(req.query, ['name', 'email', 'address']);
    const order = buildOrder(req.query, ['name', 'email', 'address', 'createdAt'], 'name');

    const stores = await Store.findAll({
      where,
      order,
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      attributes: {
        include: [[fn('AVG', col('ratings.rating')), 'avgRating']],
      },
      group: ['Store.id'],
      subQuery: false,
    });

    const formatted = stores.map((s) => {
      const store = s.toJSON();
      store.avgRating = store.avgRating ? Number(store.avgRating).toFixed(2) : null;
      return store;
    });

    res.json({ stores: formatted });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard,
  createUser,
  listUsers,
  getUserDetail,
  createStore,
  listStores,
};
