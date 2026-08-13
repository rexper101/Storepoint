const { Op, fn, col } = require('sequelize');
const { Store, Rating } = require('../models');
const { buildLikeFilters, buildOrder } = require('../utils/queryHelpers');

async function listStores(req, res, next) {
  try {
    const where = buildLikeFilters(req.query, ['name', 'address']);
    const order = buildOrder(req.query, ['name', 'address', 'createdAt'], 'name');

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

    const storeIds = stores.map((s) => s.id);
    const myRatings = await Rating.findAll({
      where: { userId: req.user.id, storeId: { [Op.in]: storeIds } },
    });
    const myRatingMap = new Map(myRatings.map((r) => [r.storeId, r.rating]));

    const formatted = stores.map((s) => {
      const store = s.toJSON();
      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: store.avgRating ? Number(store.avgRating).toFixed(2) : null,
        myRating: myRatingMap.get(store.id) || null,
      };
    });

    res.json({ stores: formatted });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStores };
