const authenticate = jest.fn((passport, strategy, options, callback) => async (req, res, next) => {
  const username = {
    cognitoId: '1234567890987654321'
  };

  await callback(null, { username }, null);
  next();
});


module.exports = authenticate;