const express = require('express');
const proposalController = require('../../controllers/proposal.controller');
const router = express.Router();

router.get('/', proposalController.helloWorld);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Proposals
 *   description: Proposals
 */

/**
 * @swagger
 * /cache:
 *   post:
 *     summary: Get all the user cache
 *     tags: [Cache]
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
