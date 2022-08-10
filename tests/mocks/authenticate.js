const { PRIMARY_USER__COGNITO_ID } = require('../utils/db.constants');

const authenticate = jest.fn((passport, strategy, options, callback) => async (req, res, next) => {
  const response = {
    username: PRIMARY_USER__COGNITO_ID,
  };
  await callback(null, response, null);
  next();
});

module.exports = authenticate;
