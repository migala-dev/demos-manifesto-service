const proposalNotification = require('./proposals');

module.exports = {
  proposalNotification: jest.fn().mockImplementation(proposalNotification)
};