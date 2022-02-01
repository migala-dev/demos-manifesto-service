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
  validate(validations.createDraft),
  spaceRoles(spaceRoleEnum.REPRESENTATIVE),
  proposalController.createAndPublishProposal
);
router.put(
  '/:spaceId/:proposalId/cancel',
  auth(),
  spaceRoles(spaceRoleEnum.REPRESENTATIVE, spaceRoleEnum.ADMIN),
  proposalStatus(proposalStatusEnum.OPEN),
  proposalController.cancelProposal
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
