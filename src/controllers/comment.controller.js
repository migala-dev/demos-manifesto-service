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
const { commentService } = require('../services');

const createComment = catchAsync(async (req, res) => {
  const comment = req.body;
  const { manifestoCommentParentId, manifestoId } = req.params;
  comment.manifestoCommentParentId = manifestoCommentParentId;

  const member = req.member;

  const result = await commentService.createComment(comment, member, manifestoId);

  res.send(result);
});

const getComment = catchAsync(async (req, res) => {
  const { manifestoCommentId } = req.params;

  const result = await commentService.getComment(manifestoCommentId);

  res.send(result);
});

const deleteComment = catchAsync(async (req, res) => {
  const { manifestoCommentId } = req.params;
  const member = req.member;

  const result = await commentService.deleteComment(manifestoCommentId, member);

  res.send(result);
});

const updateComment = catchAsync(async (req, res) => {
  const { manifestoCommentId } = req.params;
  const member = req.member;
  const { content } = req.body;

  const result = await commentService.updateComment(manifestoCommentId, member, content);

  res.send(result);
});

module.exports = {
  createComment,
  getComment,
  deleteComment,
  updateComment,
};
