/*
  DEMOS
  Copyright (C) 2022 Julian Alejandro Ortega Zepeda, Erik Ivanov Domínguez Rivera, Luis Ángel Meza Acosta
  This file is part of DEMOS.

  DEMOS is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  DEMOS is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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

const deleteDraft = catchAsync(async (req, res) => {
  const { proposal, member } = req;
  const result = await proposalService.deleteDraft(proposal, member);
  res.send(result);
});

const updateAndPublishDraft = catchAsync(async (req, res) => {
  const proposalDraft = req.body;
  const { proposal, member, space } = req;
  const result = await proposalService.updateAndPublishDraft(proposal, member, space, proposalDraft);
  res.send(result);
});

const updateProposal = catchAsync(async (req, res) => {
  const proposalInfo = req.body;
  const { proposal, member, space } = req;
  const result = await proposalService.updateProposal(proposal, member, space, proposalInfo);
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

const voteProposal = catchAsync(async (req, res) => {
  const { proposal, member } = req;
  const voteInfo = req.body;

  const result = await proposalService.voteProposal(proposal, member, voteInfo);

  res.send(result);
});

const getProposalParticipation = catchAsync(async (req, res) => {
  const { participationId } = req.params;

  const result = await proposalService.getProposalParticipation(participationId);

  res.send(result);
});

module.exports = {
  createDraft,
  updateDraft,
  deleteDraft,
  updateAndPublishDraft,
  getProposal,
  createAndPublishProposal,
  cancelProposal,
  updateProposal,
  voteProposal,
  getProposalParticipation
};
