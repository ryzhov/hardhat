const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameItem contract", function () {
  it("Should return name after deployment", async function () {
    const contract = await ethers.deployContract("GameItem");
    const deployedName = await contract.name();
    expect(deployedName).to.equal("GameItem");
  });

  it("Should award an item to player", async function () {
    const [player_0, player_1] = await ethers.getSigners();
    const contract = await ethers.deployContract("GameItem");
    const tokenUri = "https://bafybeieorvxck7qlfysiya754ertytcihamgrzq3enyeyp6tynwsemqdzy.ipfs.dweb.link?filename=hammer.json";
    const fakeUri = "https://fake.link";

    const player0ItemId = await contract.awardItem(player_0.address, tokenUri);
    console.log('player0ItemId =>', player0ItemId);

    const player1ItemId = await contract.awardItem(player_1.address, fakeUri);
    console.log('player1ItemId =>', player1ItemId);

    // -- check ownership
    expect(await contract.ownerOf(0)).to.equal(player_0.address);
    expect(await contract.ownerOf(1)).to.equal(player_1.address);

    // -- check uri
    expect(await contract.tokenURI(0)).to.equal(tokenUri);
    expect(await contract.tokenURI(1)).to.equal(fakeUri);
  });
});
