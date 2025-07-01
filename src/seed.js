const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await sequelize.sync({ force: false }); // Drops and recreates tables
  await User.create({
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log('Admin user created');
  process.exit(0);
};

seed().catch(console.error);