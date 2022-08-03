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

const { suggestionStatusEnum } = require('../shared/enums');
const ManifestoRepository = require('../shared/repositories/manifesto.repository');
const SuggestionRepository = require('../shared/repositories/suggestion.repository');
const MemberRepository = require('../shared/repositories/member.repository');
const SuggestionParticipationRepository = require('../shared/repositories/suggestion-participation.repository');
const suggestionNotification = require('../shared/notifications/suggestion.notification');

/**
 * Creates and publishes a suggestion
 * @param {Suggestion} suggestion 
 * @param {Space} space 
 * @param {Member} member 
 * @returns {Promise<{ manifesto: Manifesto, suggestion: Suggestion }>}
 */
const createAndPublishSuggestion = async (suggestion, space, member) => {
  const { spaceId } = space;
  const { userId } = member;
  
  const manifesto = await ManifestoRepository.createManifesto(suggestion, spaceId, userId);

  const suggestionCreated = await SuggestionRepository.createSuggestion(
    manifesto.manifestoId,
    suggestionStatusEnum.OPEN,
    userId
  );

  const { suggestionId } = suggestionCreated;
  suggestionNotification.suggestionUpdated(spaceId, suggestionId, userId)

  return { manifesto, suggestion: suggestionCreated };
};

const createSuggestionParticipations = async (spaceId, suggestionId) => {
  const members = await MemberRepository.findBySpaceIdAndInvitationStatusAccepted(spaceId);
  const participations = Promise.all(members.map(({ userId, memberId }) => 
    SuggestionParticipationRepository.createSuggestionParticipation(suggestionId, userId, memberId)
  ));

  return participations;
};

module.exports = {
  createAndPublishSuggestion
};