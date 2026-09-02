require('dotenv').config();
const { sequelize, User } = require('../src/models');

// Creates one admin account so you don't have to hand-edit the database to
// get started. Override via env vars if you don't want the defaults.
async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@storepoint.test';
  const password = process.env.SEED_ADMIN_PASSWORD || 'AdminPass1!';
  const name = process.env.SEED_ADMIN_NAME || 'Default Platform Administrator';

  