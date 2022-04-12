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

/**
 * Create manifesto comment
 * @param {string} content
 * @param {string} manifestoCommentParentId
 * @param {string} memberId
 * @param {string} manifesto_id
 * @returns {Promise<ManifestoComment>}
 */
const createComment = async (content, manifestoCommentParentId, memberId, manifestoId, spaceId, userId) => {
  const manifestoComment = await ManifestoCommentRepository.createManifestoComment(
    content,
    manifestoCommentParentId,
    memberId,
    manifestoId
  );

  commentNotification.newComment(spaceId, manifestoComment.manifestoCommentId, userId);

  return { manifestoComment };
};

module.exports = {
  createComment,
};
