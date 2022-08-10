const findById = jest.fn(async spaceId => ({
  spaceId: '1234567890987654321',
  aprovalPercentage: 70,
  participantionPercentage: 70
}));

module.exports = {
  findById
};