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

  proposalNotification.proposalUpdated(spaceId, proposalId, member.userId);

  return { manifesto, manifestoOptions, proposal: proposalUpdated };
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

  return { manifesto, manifestoOptions, proposal, participations };
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
      ProposalParticipationRepository.createProposalParticipation(proposalId, userId, memberId)
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
