const { PRIMARY_USER__COGNITO_ID } = require('../utils/constants');

const authenticate = jest.fn((passport, strategy, options, callback) => async (req, res, next) => {
  const response = {
    username: PRIMARY_USER__COGNITO_ID,
  };
  console.log(response);
  await callback(null, response, null);
  next();
});

module.exports = authenticate;
