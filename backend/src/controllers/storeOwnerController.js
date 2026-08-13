const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');

async function getDashboard(req, res, next) {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });
    if (!store) {
      return res.status(404).json({ message: 'No store is registered to this account yet' });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    const avg = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[fn('AVG', col('rating')), 'avgRating']],
      raw: true,
    });

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating: avg.avgRating ? Number(avg.avgRating).toFixed(2) : null,
      raters: ratings.map((r) => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        rating: r.rating,
        ratedAt: r.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
