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

const ManifestoCommentVote = require('../shared/models/manifesto-comment-vote.model');
const Member = require('../shared/models/member.model');
const ManifestoCommentVoteRepository = require('../shared/repositories/manifesto-comment-vote.repository');

/**
 * Create and publish a proposal
 * @param {ManifestoCommentVote} vote
 * @param {Member} member
 * @returns {Promise<ManifestoCommentVote>}
 */

const createCommentVote = async (vote, member) => {
  const commentVote = await ManifestoCommentVoteRepository.createManifestoCommentVote(
    vote.manifestoCommentId,
    vote.upvote,
    member.userId
  );

  return commentVote;
};

/**
 * Create and publish a proposal
 * @param {string} manifestoCommentVoteId
 * @returns {Promise<ManifestoCommentVote>}
 */
const getCommentVote = async (manifestoCommentVoteId) => {
  const commentVote = await ManifestoCommentVoteRepository.findById(manifestoCommentVoteId);

  return commentVote;
};

/**
 * Create and publish a proposal
 * @param {string} manifestoCommentVoteId
 * @param {boolean} upvote
 * @returns {Promise<ManifestoCommentVote>}
 */
const updateCommentVote = async (manifestoCommentVoteId, upvote) => {
  const commentVote = await ManifestoCommentVoteRepository.updateCommentVote(manifestoCommentVoteId, upvote);

  return commentVote;
};

module.exports = {
  createCommentVote,
  getCommentVote,
  updateCommentVote,
};
