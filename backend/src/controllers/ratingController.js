const { Store, Rating } = require('../models');

// Handles both POST (submit) and PUT (modify) — both are just an upsert against
// the unique (user_id, store_id) constraint, so one handler covers both.
async function submitRating(req, res, next) {
  try {
    const storeId = Number(req.params.id);
    const { rating } = req.body;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const [record, created] = await Rating.findOrCreate({
      where: { userId: req.user.id, storeId },
      defaults: { rating },
    });

    if (!created) {
      record.rating = rating;
      await record.save();
    }

    res.status(created ? 201 : 200).json({ rating: record });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitRating };
