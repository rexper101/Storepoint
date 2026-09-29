require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (
      process.env.NODE_ENV === 'production' &&
      (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
    ) {
      throw new Error('JWT_SECRET must be configured with at least 32 characters in production');
    }

    await sequelize.authenticate();
    console.log('Database connection established');

    if (process.env.NODE_ENV === 'production') {
      console.log('Skipping automatic schema sync in production; apply database migrations before startup');
    } else {
      // Dev convenience: creates/updates tables to match the models above.
      await sequelize.sync({ alter: true });
      console.log('Models synced');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
