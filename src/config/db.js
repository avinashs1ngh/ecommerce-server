const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: 'mysql',
    logging: false, // Disable SQL query logging (optional)
  }
);

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');
    await sequelize.sync({ force: false }); 
    console.log('Database synchronized');
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, initializeDatabase };