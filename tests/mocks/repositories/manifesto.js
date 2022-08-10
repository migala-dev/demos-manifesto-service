const createManifesto = jest.fn(async (manifesto, spaceId, userId) => ({
  manifestoId: '1234567890987654321',
}));


module.exports = {
  createManifesto,
};
