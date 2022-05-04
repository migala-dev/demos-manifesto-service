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

const httpStatus = require('http-status');
const ApiError = require('../shared/utils/ApiError');
const ProposalRepository = require('../shared/repositories/proposal.repository');
const ManifestoRepository = require('../shared/repositories/manifesto.repository');
const ManifestoOptionRepository = require('../shared/repositories/manifesto-option.repository');
const ProposalParticipationRepository = require('../shared/repositories/proposal-participation.repository');
const MemberRepository = require('../shared/repositories/member.repository');
const ProposalVoteRepository = require('../shared/repositories/proposal-vote.repository');
const Manifesto = require('../shared/models/manifesto.model');
const { optionTypeEnum, proposalStatusEnum } = require('../shared/enums');
const ManifestoOption = require('../shared/models/manifesto-option.model');
const Proposal = require('../shared/models/proposal.model');
const proposalNotification = require('../shared/notifications/proposals.notification');
const ProposalParticipation = require('../shared/models/proposal-participation.model');
const logger = require('../shared/config/logger');

const canCreateOptions = (optionType, options) =>
  optionType === optionTypeEnum.MULTIPLE_OPTIONS && !!options && options.length > 0;

/**
 * Create a draft
 * @param {Space} space
 * @param {Member} member
 * @param {Proposal} proposalCraft
 * @returns {Promise<{ manifesto: Manifesto, manifestoOptions: ManifestoOption[], proposal: Proposal }}>}
 */
const createDraft = async (space, member, proposalDraft) => {
  const { userId } = member;
  const { spaceId } = space;

  const manifesto = await ManifestoRepository.createManifesto(proposalDraft, spaceId, userId);

  let manifestoOptions = [];
  const { options, optionType } = proposalDraft;
  if (canCreateOptions(optionType, options)) {
    manifestoOptions = await ManifestoOptionRepository.createOptions(options, manifesto.manifestoId, userId);
  }

  const proposal = await ProposalRepository.createProposal(manifesto.manifestoId, proposalStatusEnum.DRAFT, spaceId, userId);

  return { manifesto, manifestoOptions, proposal };
};

/**
 * Update a draft proposal
 * @param {Proposal} proposal
 * @param {Member} member
 * @param {Proposal} proposalCraft
 * @returns {Promise<{ manifesto: Manifesto, manifestoOptions: ManifestoOption[], proposal: Proposal }}>}
 */
const updateDraft = async (proposal, member, proposalDraft) => {
  const { manifestoId } = proposal;
  const { userId } = member;

  const manifesto = await ManifestoRepository.updateManifesto(manifestoId, proposalDraft, userId);

  let manifestoOptions = [];
  const { options } = proposalDraft;
  if (proposalDraft.optionType === optionTypeEnum.MULTIPLE_OPTIONS && !!options && options.length > 0) {
    manifestoOptions = await ManifestoOptionRepository.updateOrCreateOptions(options, manifestoId, userId);
    await ManifestoOptionRepository.removeAllMissingOptions(manifestoOptions, manifestoId);
  }

  return { manifesto, manifestoOptions, proposal };
};

/**
 * Update a draft and publish proposal
 * @param {Proposal} proposal
 * @param {Member} member
 * @param {Proposal} proposalCraft
 * @returns {Promise<{ manifesto: Manifesto, manifestoOptions: ManifestoOption[], proposal: Proposal }}>}
 */
const updateAndPublishDraft = async (proposal, member, proposalDraft) => {
  const { proposalId, spaceId } = proposal;
  const { manifesto, manifestoOptions } = await updateDraft(proposal, member, proposalDraft);

  const proposalUpdated = await ProposalRepository.updateProposal(
    proposal.proposalId,
    proposalStatusEnum.OPEN,
    member.userId
  );

  const participations = await createProposalParticipations(spaceId, proposalId);

  proposalNotification.proposalUpdated(spaceId, proposalId, member.userId);

  return { manifesto, manifestoOptions, proposal: proposalUpdated, participations };
};

/**
 * Update an open proposal
 * @param {Proposal} proposal
 * @param {Member} member
 * @param {Proposal} proposalInfo
 * @returns {Promise<{ manifesto: Manifesto, manifestoOptions: ManifestoOption[], proposal: Proposal }}>}
 */
const updateProposal = async (proposal, member, proposalInfo) => {
  const { proposalId, spaceId } = proposal;
  const { manifesto, manifestoOptions } = await updateDraft(proposal, member, proposalInfo);

  const proposalUpdated = await ProposalRepository.updateProposal(
    proposal.proposalId,
    proposalStatusEnum.OPEN,
    member.userId
  );

  await ProposalParticipationRepository.deleteByProposalId(proposalId);
  await ProposalVoteRepository.deleteByProposalId(proposalId);

  const participations = await createProposalParticipations(spaceId, proposalId);

  proposalNotification.proposalUpdated(spaceId, proposalId);

  return { manifesto, manifestoOptions, proposal: proposalUpdated, participations };
};

/**
 * Get a proposal with the manifesto and the manifesto options
 * @param {Proposal} proposal
 * @returns {Promise<{ manifesto: Manifesto, manifestoOptions: ManifestoOption[], proposal: Proposal, participations: ProposalParticipation[] }}>}
 */
const getProposal = async (proposal) => {
  const { manifestoId, proposalId } = proposal;

  const manifesto = await ManifestoRepository.findById(manifestoId);

  const manifestoOptions = await ManifestoOptionRepository.findAllByManifestoId(manifestoId);

  const participations = await ProposalParticipationRepository.findByProposalId(proposalId);

  let votes = [];

  if (proposal.status === proposalStatusEnum.CLOSED) {
    votes = await ProposalVoteRepository.findByProposalId(proposal.proposalId);
  }

  return { manifesto, manifestoOptions, proposal, participations, votes };
};

/**
 * Create and publish a proposal
 * @param {Proposal} proposal
 * @param {Space} space
 * @param {Member} member
 * @returns {Promise<{ manifesto: Manifesto, manifestoOptions: ManifestoOption[], proposal: Proposal, participations: ProposalParticipation[] }}>}
 */
const createAndPublishProposal = async (proposal, space, member) => {
  const { spaceId } = space;
  const { userId } = member;

  const manifesto = await ManifestoRepository.createManifesto(proposal, spaceId, userId);

  let manifestoOptions = [];
  const { options, optionType } = proposal;
  if (canCreateOptions(optionType, options)) {
    manifestoOptions = await ManifestoOptionRepository.createOptions(options, manifesto.manifestoId, userId);
  }

  const proposalCreated = await ProposalRepository.createProposal(
    manifesto.manifestoId,
    proposalStatusEnum.OPEN,
    spaceId,
    userId
  );

  const participations = await createProposalParticipations(spaceId, proposalCreated.proposalId);

  proposalNotification.proposalUpdated(spaceId, proposalCreated.proposalId, userId);

  return { manifesto, manifestoOptions, proposal: proposalCreated, participations };
};

const createProposalParticipations = async (spaceId, proposalId) => {
  const members = await MemberRepository.findBySpaceIdAndInvitationStatusAccepted(spaceId);
  return Promise.all(
    members.map(({ memberId, userId }) =>
      ProposalParticipationRepository.createProposalParticipation(proposalId, userId, memberId, spaceId)
    )
  );
};

/**
 * Cancel a Proposal
 * @param {Proposal} proposal
 * @param {Member} member
 * @returns {Promise<Proposal}>}
 */
const cancelProposal = async (proposal, member) => {
  const { proposalId, spaceId } = proposal;
  const { userId } = member;

  const proposalCancelled = await ProposalRepository.updateProposal(proposalId, proposalStatusEnum.CANCELLED, userId);

  proposalNotification.proposalUpdated(spaceId, proposalId, userId);

  return { proposal: proposalCancelled };
};

/**
 * Delete a Proposal draft
 * @param {Proposal} proposal
 * @param {Member} member
 * @returns {Promise<Proposal}>}
 */
const deleteDraft = async (proposal, member) => {
  const { proposalId } = proposal;
  const { userId } = member;

  const proposalDeleted = await ProposalRepository.updateProposal(proposalId, proposalStatusEnum.DELETED, userId);

  return { proposal: proposalDeleted };
};

/**
 * Vote a Proposal
 * @param {Proposal} proposal
 * @param {Member} member
 * @param {Object} voteInfo
 * @returns {Promise<{ proposalParticipation: ProposalParticipation }}>}
 */
const voteProposal = async (proposal, member, voteInfo) => {
  const { proposalId, spaceId } = proposal;
  const { userId } = member;

  let participation = await ProposalParticipationRepository.findByProposalIdAndUserId(proposalId, userId);

  if (participation === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can not vote on this proposal.');
  } else {
    await vote(participation, voteInfo);
    participation = await ProposalParticipationRepository.updateProposalParticipation(participation.proposalParticipationId, true);
    proposalNotification.proposalVoteUpdated(spaceId, proposalId, participation.proposalParticipationId, userId);
  }
  return { proposalParticipation: participation };
};

const vote = async (participation, voteInfo) => {
  if (participation.participated) {
    await updateVote(voteInfo);
  } else {
    const { inFavor, manifestoOptionId, userHash, nullVoteComment } = voteInfo;
    await ProposalVoteRepository.createProposalVote(participation.proposalId, userHash, manifestoOptionId, inFavor, nullVoteComment);
  }
}

const updateVote = async (voteInfo) => {
  const { inFavor, manifestoOptionId, userHash, nullVoteComment } = voteInfo;
  const oldVote = await ProposalVoteRepository.findByUserHash(userHash);

  if (oldVote !== undefined) {
    await ProposalVoteRepository.updateProposalVote(oldVote.proposalVoteId, manifestoOptionId, inFavor, nullVoteComment);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'It is not posible to update this vote.');
  }
}

/**
 * Get Proposal participation
 * @param {Proposal} proposal
 * @param {Member} member
 * @returns {Promise<{ proposalParticipation: ProposalParticipation }}>}
 */
 const getProposalParticipation = async (participationId) => {

  let participation = await ProposalParticipationRepository.findById(participationId);

  return { proposalParticipation: participation };
};

/**
 * Check the expiration date from the proposal in progress or open
 * @returns {Promise<void>}>}
 */
const checkProposalsExpirationDate = async () => {
  const proposals = await ProposalRepository.findByStatus(proposalStatusEnum.OPEN);
  logger.info(`Checking proposals expiration date (${proposals.length} proposals) `);
  for(const proposal of proposals) {
    const now = new Date();
    const expirationDate = new Date(proposal.expiredAt); 
    if (expirationDate < now) {
      logger.info(`Closing proposal: ${proposal.proposalId}`);
      const doNotUpdateExpirationDate = true;
      await ProposalRepository.updateProposal(proposal.proposalId, proposalStatusEnum.CLOSED, null, doNotUpdateExpirationDate);
      proposalNotification.proposalUpdated(proposal.spaceId, proposal.proposalId);
    }
  }
}

// Every 3 minutes 
const intervalTime = 1 * 60 * 1000;
setInterval(() => checkProposalsExpirationDate(), intervalTime)

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
  getProposalParticipation,
};
