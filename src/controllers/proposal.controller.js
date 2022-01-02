const catchAsync = require('../shared/utils/catchAsync');
const { proposalService } = require('../services');

const helloWorld = catchAsync(async (req, res) => {
  const result = await proposalService.helloWorld();
  res.send(result);
});

module.exports = {
  helloWorld,
};
