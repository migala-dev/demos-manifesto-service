const authenticate = jest.fn((strategy, options, callback) => (req, res, next) => {
  const tokenUser = {
  }
  callback(null, {}, {});


});

module.exports = authenticate;