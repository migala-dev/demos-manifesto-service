const httpStatus = require('http-status');
const { JsonWebTokenError } = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');

setupTestDB();

describe('Proposal routes', () => { 

  describe('POST /v1/proposals/:spaceId/publish', () => {
    const proposal = {
      title: 'Test proposal tests',
      content: '',
      optionType: 0,
      options: []
    };

    test('should return 200 and create and publish proposal', async () => {
      const spaceId = '1234567890987654321';
      const res = await request(app)
        .post(`/v1/proposals/${spaceId}/publish`)
        .set({
          'Authorization': 'Bearer 1234567890987654321',
          'Content-Type': 'application/json'
        })
        .send(proposal);
      
      console.log(res.body);
      expect(res.statusCode).toBe(httpStatus.OK);
    });
  });
});