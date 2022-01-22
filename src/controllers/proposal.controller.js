const catchAsync = require('../shared/utils/catchAsync');
const { proposalService } = require('../services');

const createDraft = catchAsync(async (req, res) => {
  const proposalDraft = req.body;
  const { space, member } = req;
  const result = await proposalService.createDraft(space, member, proposalDraft);
  res.send(result);
});

module.exports = {
  createDraft,
};
