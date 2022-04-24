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
const commentVoteService = require('../services/comment_vote.service');

const createCommentVote = catchAsync(async (req, res) => {
  const vote = req.body;
  const { manifestoCommentId } = req.params;
  vote.manifestoCommentId = manifestoCommentId;

  const member = req.member;

  const result = await commentVoteService.createCommentVote(vote, member);

  res.send(result);
});

const getCommentVote = catchAsync(async (req, res) => {
  const { manifestoCommentVoteId } = req.params;
  const result = await commentVoteService.getCommentVote(manifestoCommentVoteId);

  res.send(result);
});

const updateCommentVote = catchAsync(async (req, res) => {
  const { manifestoCommentVoteId } = req.params;
  const { upvote } = req.body;
  const result = await commentVoteService.updateCommentVote(manifestoCommentVoteId, upvote);

  res.send(result);
});

const deleteCommentVote = catchAsync(async (req, res) => {
  const { manifestoCommentVoteId } = req.params;
  await commentVoteService.deleteCommentVote(manifestoCommentVoteId);

  res.send({ manifestoCommentVoteId });
});

module.exports = {
  createCommentVote,
  getCommentVote,
  updateCommentVote,
  deleteCommentVote,
};
