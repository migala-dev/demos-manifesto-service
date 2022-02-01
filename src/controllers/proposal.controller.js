const catchAsync = require('../shared/utils/catchAsync');
const { proposalService } = require('../services');

const createDraft = catchAsync(async (req, res) => {
  const proposalDraft = req.body;
  const { space, member } = req;
  const result = await proposalService.createDraft(space, member, proposalDraft);
  res.send(result);
});

const updateDraft = catchAsync(async (req, res) => {
  const proposalDraft = req.body;
  const { proposal, member } = req;
  const result = await proposalService.updateDraft(proposal, member, proposalDraft);
  res.send(result);
});

const updateAndPublishDraft = catchAsync(async (req, res) => {
  const proposalDraft = req.body;
  const { proposal, member } = req;
  const result = await proposalService.updateAndPublishDraft(proposal, member, proposalDraft);
  res.send(result);
});

const getProposal = catchAsync(async (req, res) => {
  const { proposal } = req;
  const result = await proposalService.getProposal(proposal);
  res.send(result);
});

const createAndPublishProposal = catchAsync(async (req, res) => {
  const proposal = req.body;
  const { space, member } = req;
  const result = await proposalService.createAndPublishProposal(proposal, space, member);
  res.send(result);
});

const cancelProposal = catchAsync(async (req, res) => {
  const { proposal, member } = req;
  const result = await proposalService.cancelProposal(proposal, member);
  res.send(result);
});


module.exports = {
  createDraft,
  updateDraft,
  updateAndPublishDraft,
  getProposal,
  createAndPublishProposal,
  cancelProposal
};
