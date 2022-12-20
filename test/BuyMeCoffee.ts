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

    it("Should revert with invalid id", async function () {
      const { buyCoffee, otherAccount } = await loadFixture(deployBuyMeCoffee);

      await expect(buyCoffee.connect(otherAccount).tipCoffee(7)).to.be.revertedWith(
        "Id: not found"
      );
    });

    describe("CreateUser && tipCoffee", function () {
      let _buyCoffee:any, _owner:any, _otherAccount:any;

      it("Should revert with description is null", async function () {
          const { buyCoffee, owner, otherAccount } = await loadFixture(deployBuyMeCoffee);
          _buyCoffee = buyCoffee; _owner = owner; _otherAccount = otherAccount;
          await expect(_buyCoffee.CreateUser("", "", _owner.address)).to.be.revertedWith(
            "description is null"
          )
      })
      it("Should revert with image URL is null", async function () {
        await expect(_buyCoffee.CreateUser("", "alsdjf", _owner.address)).to.be.revertedWith(
          "Image URL is null"
        )
      })
      it("Should create user and emit event", async function () {
        await expect(_buyCoffee.CreateUser("ALSDFJA", "alksdjfal", _owner.address)).to.emit(_buyCoffee,
          "ClientCreated( uint256 indexed userId, string ulrImg, string _description, address payable wallet)"
          );
      });
      it("Should tip user", async function () {
        const balanceBefore = await ethers.provider.getBalance(_owner.address)
        await _buyCoffee.connect(_otherAccount).tipCoffee(1, {value: ethers.utils.parseEther("1.0")});
        const balanceAfter = await ethers.provider.getBalance(_owner.address)

        expect(balanceBefore).to.be.lessThan(balanceAfter)
      });
    });
  });
});
