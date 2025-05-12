require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    database: process.env.MYSQL_DATABASE || 'ecommerce',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
  },
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};