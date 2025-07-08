const getPublic = async (req, res, next) => {
  try {
   res.status(200).json({
    success: true,
    message: 'Welcome to the E-commerce Public API',
   });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPublic };
