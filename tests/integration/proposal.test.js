const httpStatus = require('http-status');
const request = require('supertest');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const testConstants = require('../utils/db.constants');
const { optionTypeEnum, proposalStatusEnum } = require('../../src/shared/enums');
const toContainObject = require('../utils/toContainObject');
const executeQuery = require('../utils/executeQuery');
const CacheRepository = require('../../src/shared/repositories/cache.repository');

jest.mock('websocket');

setupTestDB();

expect.extend({ toContainObject });

describe('Proposal routes', () => {
  const spaceId = testConstants.SPACE_ID;

  describe('POST /v1/proposals/:spaceId/publish create and publish proposal', () => {
    const url = `/v1/proposals/${spaceId}/publish`;
    const headers = {
      'Authorization': testConstants.REPRESENTATIVE_USER__COGNITO_ID,
      'Content-Type': 'application/json',
    };
    const defaultProposal = {
      title: 'Test proposal tests',
      content: null,
      optionType: optionTypeEnum.IN_FAVOR_OR_OPPOSSING,
      options: [{ title: 'Test option' }],
    };

    test('should return 200, create and publish an in favor or opposing proposal', async () => {
      const newProposal = { ...defaultProposal };

      const res = await request(app).post(url).set(headers).send(newProposal);
      const { proposal, manifestoOptions, manifesto, participations } = res.body;
      //console.log('proposal: ', proposal);
      //console.log('manifesto: ', manifesto);
      //console.log('participations: ', participations);

      expect(res.statusCode).toBe(httpStatus.OK);
      expect(manifesto.title).toBe(newProposal.title);
      expect(manifesto.content).toBe(newProposal.content);
      expect(manifesto.optionType).toBe(optionTypeEnum.IN_FAVOR_OR_OPPOSSING);
      expect(proposal.manifestoId).toBe(manifesto.manifestoId);
      expect(proposal.status).toBe(proposalStatusEnum.OPEN);
      expect(manifestoOptions).toHaveLength(0);
      expect(participations).toHaveLength(3);
    });

    test('should return 400 if no title is provided', async () => {
      const newProposal = {
        ...defaultProposal,
        title: null,
      };

      const res = await request(app).post(url).set(headers).send(newProposal);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if no optionType is provided', async () => {
      const newProposal = {
        ...defaultProposal,
        optionType: null,
      };

      const res = await request(app).post(url).set(headers).send(newProposal);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
    });

    test('should return 200, create and publish a multiple options proposal with more than or equal to 2 options', async () => {
      const options = [{ title: 'Option 1' }, { title: 'Option 2' }];
      const newProposal = {
        ...defaultProposal,
        optionType: optionTypeEnum.MULTIPLE_OPTIONS,
        options,
      };

      const res = await request(app).post(url).set(headers).send(newProposal);
      const { proposal, manifestoOptions, manifesto, participations } = res.body;

      expect(res.statusCode).toBe(httpStatus.OK);
      expect(manifesto.title).toBe(newProposal.title);
      expect(manifesto.content).toBe(newProposal.content);
      expect(manifesto.optionType).toBe(optionTypeEnum.MULTIPLE_OPTIONS);
      expect(proposal.manifestoId).toBe(manifesto.manifestoId);
      expect(proposal.status).toBe(proposalStatusEnum.OPEN);
      expect(participations).toHaveLength(3);
      expect(manifestoOptions).toHaveLength(2);
      expect(manifestoOptions).toContainObject({
        manifestoId: manifesto.manifestoId,
        title: options[0].title,
      });
      expect(manifestoOptions).not.toContainObject({ deleted: true });
    });

    test('should return 400 if less than 2 options are given in a multiple options proposal', async () => {
      const newProposal = {
        ...defaultProposal,
        optionType: optionTypeEnum.MULTIPLE_OPTIONS,
      };

      const res = await request(app).post(url).set(headers).send(newProposal);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
    });

    test('should create a participation for each member when a proposal is creted and published', async () => {
      const newProposal = { ...defaultProposal };

      const res = await request(app).post(url).set(headers).send(newProposal);
      const { proposal, participations } = res.body;

      expect(participations).toHaveLength(3);
      expect(participations).toContainObject({
        proposalId: proposal.proposalId,
        spaceId: spaceId,
      });
      expect(participations).not.toContainObject({ participated: true });
    });

    test('should create cache for all other members when a proposal is created and published', async () => {
      const spyCreateCache = jest.spyOn(CacheRepository, 'createCache');
      const newProposal = { ...defaultProposal };
      const query = `SELECT * FROM cache;`;

      await request(app).post(url).set(headers).send(newProposal);
      const cache = await executeQuery(query);

      expect(cache).toHaveLength(2);
      expect(spyCreateCache).toHaveBeenCalledTimes(2);
    });
  });
});
