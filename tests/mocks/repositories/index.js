const UserRepository = require('./user');
const MemberRepository = require('./member');
const SpaceRepository = require('./space');
const ManifestoRepository = require('./manifesto');
const ManifestoOptionRepository = require('./manifesto-option');
const ProposalRepository = require('./proposal');
const ProposalParticipationRepository = require('./proposal-participation');

module.exports = {
  UserRepository,
  MemberRepository,
  SpaceRepository,
  ManifestoRepository,
  ManifestoOptionRepository,
  ProposalRepository,
  ProposalParticipationRepository
};