const express = require('express');
const auth = require('../../shared/middlewares/auth');
const validate = require('../../shared/middlewares/validate');
const proposalController = require('../../controllers/proposal.controller');
const router = express.Router();
const validations = require('../../validations/proposals.validation');
const { spaceRoleEnum } = require('../../shared/enums');
const spaceRole = require('../../shared/middlewares/space-role.middleware');

router.post('/:spaceId/draft', auth(), validate(validations.createDraft), spaceRole(spaceRoleEnum.REPRESENTATIVE),  proposalController.createDraft);

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
