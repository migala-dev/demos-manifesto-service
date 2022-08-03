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

const express = require('express');

const auth = require('../../shared/middlewares/auth');
const validate = require('../../shared/middlewares/validate');
const validations = require('../../validations/suggestion.validation');
// { sugestionStatatusEnum }
const { spaceRoleEnum } = require('../../shared/enums');
const spaceRoles = require('../../shared/middlewares/space-role.middleware');
const spaceMember = require('../../shared/middlewares/space-member.middleware');
// suggestion middleware
// suggestionStatus middleware
// suggestion controller
const suggestionController = require('../../controllers/suggestion.controller');

const router = express.Router();

// get suggestion
router.route('/:spaceId/:suggestionId').get(); 

// create suggestion draft
router.route('/:spaceId/draft').post();

// update and delete suggestion draft
router.route('/:spaceId/draft/:suggestionId').put().delete();

// update and publish suggestion draft
router.route('/:spaceId/draft/:suggestionId/publish').put();

// create and publish suggestion 
router
  .route('/:spaceId/publish')
  .post(
    auth(),
    validate(validations.suggestion),
    spaceRoles(
      spaceRoleEnum.ADMIN,
      spaceRoleEnum.WORKER,
      spaceRoleEnum.REPRESENTATIVE
    ),
    suggestionController.createAndPublishSuggestion
);

// update suggestion
router.route('/:spaceId/:suggestionId').put();

// calcel suggestion 
router.route('/:spaceId/:suggestionId/cancel').put();

// vote suggestion
router.route('/:spaceId/:suggestionId/vote').put();

// get suggestion paticipation 
router.route('/:spaceId/participation/:participationId').get();

// reset suggestion participation
router.route('/:spaceId/:suggestionId/reset').post();

module.exports = router;