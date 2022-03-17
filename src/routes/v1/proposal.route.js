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
const proposalController = require('../../controllers/proposal.controller');
const router = express.Router();
const validations = require('../../validations/proposals.validation');
const { spaceRoleEnum, proposalStatusEnum } = require('../../shared/enums');
const spaceRoles = require('../../shared/middlewares/space-role.middleware');
const proposal = require('../../shared/middlewares/proposal.middleware');
const proposalStatus = require('../../shared/middlewares/proposal-status.middleware');
const spaceMember = require('../../shared/middlewares/space-member.middleware');

router.get('/:spaceId/:proposalId', auth(), spaceMember, proposal, proposalController.getProposal);
router.post(
  '/:spaceId/draft',
  auth(),
  validate(validations.createDraft),
  spaceRoles(spaceRoleEnum.REPRESENTATIVE),
  proposalController.createDraft
);
router.put(
  '/:spaceId/draft/:proposalId',
  auth(),
  validate(validations.updateDraft),
  spaceRoles(spaceRoleEnum.REPRESENTATIVE),
  proposalStatus(proposalStatusEnum.DRAFT),
  proposalController.updateDraft
);
router.delete(
  '/:spaceId/draft/:proposalId',
  auth(),
  spaceRoles(spaceRoleEnum.REPRESENTATIVE),
  proposalStatus(proposalStatusEnum.DRAFT),
  proposalController.deleteDraft
);
router.put(
  '/:spaceId/draft/:proposalId/publish',
  auth(),
  validate(validations.updateDraft),
  spaceRoles(spaceRoleEnum.REPRESENTATIVE),
  proposalStatus(proposalStatusEnum.DRAFT),
  proposalController.updateAndPublishDraft
);
router.post(
  '/:spaceId/publish',
  auth(),
  validate(validations.proposal),
  spaceRoles(spaceRoleEnum.REPRESENTATIVE),
  proposalController.createAndPublishProposal
);
router.put(
  '/:spaceId/:proposalId',
  auth(),
  validate(validations.proposal),
  spaceRoles(spaceRoleEnum.REPRESENTATIVE),
  proposalStatus(proposalStatusEnum.OPEN),
  proposalController.updateProposal
);
router.put(
  '/:spaceId/:proposalId/cancel',
  auth(),
  spaceRoles(spaceRoleEnum.REPRESENTATIVE, spaceRoleEnum.ADMIN),
  proposalStatus(proposalStatusEnum.OPEN),
  proposalController.cancelProposal
);
router.put(
  '/:spaceId/:proposalId/vote',
  auth(),
  validate(validations.voteProposal),
  spaceMember,
  proposalStatus(proposalStatusEnum.OPEN),
  proposalController.voteProposal
);
router.get(
  '/:spaceId/participation/:participationId',
  auth(),
  spaceMember,
  proposalController.getProposalParticipation
);


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Proposals
 *   description: Proposals
 */

/**
 * @swagger
 * /draft:
 *   post:
 *     summary: Create a proposal draft
 *     tags: [Proposals]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Space'
 *       "401":
 *         description: Invalid body information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid body information
 */
