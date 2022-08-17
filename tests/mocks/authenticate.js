const authenticate = jest.fn((passport, strategy, options, callback) => async (req, res, next) => {
  
  const response = {
    username: req.header('authorization'),
  };
  await callback(null, response, null);
  next();
});

module.exports = authenticate;
