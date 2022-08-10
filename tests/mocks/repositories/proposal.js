const createProposal = jest.fn(
  async (manifestoId, status, spaceId, userId, approvalPercentage, participationPercentage) => ({
    proposalId: '1234567890987654321'
  })
);

module.exports = {
  createProposal,
};
