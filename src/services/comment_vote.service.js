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

const ApiError = require('../shared/utils/ApiError');
const httpStatus = require('http-status');
const ManifestoCommentVote = require('../shared/models/manifesto-comment-vote.model');
const Member = require('../shared/models/member.model');
const ManifestoCommentVoteRepository = require('../shared/repositories/manifesto-comment-vote.repository');
const commentVoteNotification = require('../shared/notifications/comment-vote.notification');

/**
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

  commentVoteNotification.newCommentVote(member.spaceId, commentVote.manifestoCommentVoteId, member.userId);

  return commentVote;
};

/**
 * @param {string} manifestoCommentVoteId
 * @returns {Promise<ManifestoCommentVote>}
 */
const getCommentVote = async (manifestoCommentVoteId) => {
  const commentVote = await ManifestoCommentVoteRepository.findById(manifestoCommentVoteId);

  if (!commentVote) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Nonexistent manifestoCommentVoteId.');
  }

  return commentVote;
};

/**
 * @param {string} manifestoCommentVoteId
 * @param {boolean} upvote
 * @param {Member} member
 * @returns {Promise<ManifestoCommentVote>}
 */
const updateCommentVote = async (manifestoCommentVoteId, upvote, member) => {
  const commentVote = await ManifestoCommentVoteRepository.updateCommentVote(manifestoCommentVoteId, upvote);

  commentVoteNotification.updateCommentVote(member.spaceId, commentVote.manifestoCommentVoteId, member.userId);

  return commentVote;
};

/**
 * @param {string} manifestoCommentVoteId
 * @param {Member} member
 * @returns {Promise<void>}
 */
const deleteCommentVote = async (manifestoCommentVoteId, member) => {
  await ManifestoCommentVoteRepository.deleteCommentVote(manifestoCommentVoteId);

  commentVoteNotification.deleteCommentVote(member.spaceId, manifestoCommentVoteId, member.userId);
};

module.exports = {
  createCommentVote,
  getCommentVote,
  updateCommentVote,
  deleteCommentVote,
};
