const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn, 
  });
};

module.exports = { generateToken };