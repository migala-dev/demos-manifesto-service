const httpStatus = require('http-status');
const { JsonWebTokenError } = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const testConstants = require('../utils/db.constants');
const { optionTypeEnum, proposalStatusEnum } = require('../../src/shared/enums');

setupTestDB();

describe('Proposal routes', () => { 

  describe('POST /v1/proposals/:spaceId/publish', () => {
    const newProposal = {
      title: 'Test proposal tests',
      content: null,
      optionType: optionTypeEnum.IN_FAVOR_OR_OPPOSSING,
      options: [{
        title: 'Test option'
      }]
    };

    test('should return 200 and create and publish proposal', async () => {
      const spaceId = testConstants.SPACE_ID;
      const res = await request(app)
        .post(`/v1/proposals/${spaceId}/publish`)
        .set({
          'Authorization': testConstants.REPRESENTATIVE_USER__COGNITO_ID,
          'Content-Type': 'application/json'
        })
        .send(newProposal);

      const { proposal, manifestoOptions, manifesto, participations } = res.body;

      expect(manifesto.title).toBe(newProposal.title);
      expect(manifesto.content).toBe(newProposal.content);
      expect(manifesto.optionType).toBe(optionTypeEnum.IN_FAVOR_OR_OPPOSSING);
      expect(proposal.manifestoId).toBe(manifesto.manifestoId);
      expect(proposal.status).toBe(proposalStatusEnum.OPEN);
      expect(manifestoOptions).toHaveLength(0);
      expect(participations).toHaveLength(3);

      expect(res.statusCode).toBe(httpStatus.OK);
    });
  });
});