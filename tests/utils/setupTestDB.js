const mockDBHelper = require('./mockDBHelper');

const setupTestDB = () => {
  beforeAll(async () => {
    mockDBHelper.createDB();
    await new Promise((res) => setTimeout(() => res()), 1000);
  });

  beforeEach(async () => {
    // await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
  });

  afterAll(async () => {
    // await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
