const ProposalRepository = require('../shared/repositories/proposal.repository');
const ManifestoRepository = require('../shared/repositories/manifesto.repository');
const ManifestoOptionRepository = require('../shared/repositories/manifesto-option.repository');
const Manifesto = require('../shared/models/manifesto.model');
const { optionTypeEnum, proposalStatusEnum } = require('../shared/enums');
const ManifestoOption = require('../shared/models/manifesto-option.model');
const Proposal = require('../shared/models/proposal.model');

const createManifesto = (manifesto, spaceId, userId) => {
    const newManifiesto = new Manifesto();
    newManifiesto.title = manifesto.title;
    newManifiesto.content = manifesto.content;
    newManifiesto.optionType = manifesto.optionType;
    newManifiesto.spaceId = spaceId;
    newManifiesto.createdBy = userId;
    newManifiesto.updatedBy = userId;
    
    return ManifestoRepository.create(newManifiesto);
}

module.exports = {

}