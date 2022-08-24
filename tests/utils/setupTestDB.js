const mockDBHelper = require('./mockDBHelper');

const setupTestDB = () => {
  beforeAll(async () => {
    mockDBHelper.createDB();
    await new Promise((res) => setTimeout(() => res()), 1000);
  });

  beforeEach(async () => {
    mockDBHelper.restore();
  });

  afterAll(async () => {
    // await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
