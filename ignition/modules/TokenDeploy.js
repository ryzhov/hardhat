const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule('TokenDeploy', builder => {
  const player_0 = builder.getAccount(0);
  const contract = builder.contract('GameItem', [], {from: player_0});

  return { contract };
});
