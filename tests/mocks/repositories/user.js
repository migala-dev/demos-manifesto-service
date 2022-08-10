const findOneByCognitoId = jest.fn(async cognitoId => ({
  userId: '1234567890987654321'
}));

module.exports = {
  findOneByCognitoId
};