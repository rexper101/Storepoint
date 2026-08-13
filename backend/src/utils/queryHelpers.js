const { Op } = require('sequelize');

// Partial, case-insensitive match on the given fields if present in the query string.
function buildLikeFilters(query, fields) {
  const where = {};
  fields.forEach((field) => {
    if (query[field]) {
      where[field] = { [Op.like]: `%${query[field]}%` };
    }
  });
  return where;
}

// Whitelists sortBy against allowedFields to avoid injecting arbitrary column names.
function buildOrder(query, allowedFields, defaultField = 'id') {
  const sortBy = allowedFields.includes(query.sortBy) ? query.sortBy : defaultField;
  const order = query.order && query.order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return [[sortBy, order]];
}

module.exports = { buildLikeFilters, buildOrder };
