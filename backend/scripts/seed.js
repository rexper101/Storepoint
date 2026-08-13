require('dotenv').config();
const { sequelize, User } = require('../src/models');

// Creates one admin account so you don't have to hand-edit the database to
// get started. Override via env vars if you don't want the defaults.
async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@storepoint.test';
  const password = process.env.SEED_ADMIN_PASSWORD || 'AdminPass1!';
  const name = process.env.SEED_ADMIN_NAME || 'Default Platform Administrator';

  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log(`Admin already exists: ${email}`);
      process.exit(0);
    }

    await User.create({ name, email, password, address: null, role: 'admin' });

    console.log('Admin account created:');
    console.log(`  email:    ${email}`);
    console.log(`  password: ${password}`);
    console.log('Log in and change this password — see /account/password once you\'re signed in.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
