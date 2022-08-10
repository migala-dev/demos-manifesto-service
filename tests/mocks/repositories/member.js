const { spaceRoleEnum } = require('../../../src/shared/enums');

const findByUserIdAndSpaceId = jest.fn(async (userId, spaceId) => ({
  userId: '1234567890987654321',
  role: spaceRoleEnum.REPRESENTATIVE
}));

const findBySpaceIdAndInvitationStatusAccepted = jest.fn(async (spaceId) => ([
  {
    userId: '1234567890987654321',
    memberId: '1234567890987654321',
    role: spaceRoleEnum.REPRESENTATIVE
  },
  {
    userId: '1234567890987654322',
    memberId: '1234567890987654322',
    role: spaceRoleEnum.ADMIN
  }
]));

module.exports = {
  findByUserIdAndSpaceId,
  findBySpaceIdAndInvitationStatusAccepted
};