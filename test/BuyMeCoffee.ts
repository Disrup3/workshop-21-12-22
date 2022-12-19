import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BuyMeCoffee", function () {

  async function deployBuyMeCoffee() {

    const [owner, otherAccount] = await ethers.getSigners();
    const BuyMeCoffee = await ethers.getContractFactory("BuyMeCoffee");
    const buyCoffee = await BuyMeCoffee.deploy();
    await buyCoffee.deployed();
    return {buyCoffee, owner, otherAccount};
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { buyCoffee, owner } = await loadFixture(deployBuyMeCoffee);

      expect(await buyCoffee.owner()).to.equal(owner.address);
    });
  });

  describe("tipsCoffees", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        const { buyCoffee } = await loadFixture(deployBuyMeCoffee);

        await expect(buyCoffee.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });
    });
  });
});
