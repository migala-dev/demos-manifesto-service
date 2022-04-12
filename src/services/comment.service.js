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

const ManifestoCommentRepository = require('../shared/repositories/manifesto-comment.repository');
const commentNotification = require('../shared/notifications/comment.notification');
const ManifestoComment = require('../shared/models/manifesto-comment.model');
const Member = require('../shared/models/member.model');

/**
 * Create manifesto comment
 * @param {ManifestoComment} comment
 * @param {Member} member
 * @param {string} manifestoCommentParentId
 * @param {string} memberId
 * @param {string} manifesto_id
 * @returns {Promise<ManifestoComment>}
 */
const createComment = async (comment, member, manifestoId) => {
  const manifestoComment = await ManifestoCommentRepository.createManifestoComment(
    comment.content,
    comment.manifestoCommentParentId,
    member.memberId,
    manifestoId
  );

  commentNotification.newComment(member.spaceId, manifestoComment.manifestoCommentId, member.userId);

  return { manifestoComment };
};

module.exports = {
  createComment,
};
