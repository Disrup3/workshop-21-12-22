import { ethers } from "hardhat";

async function main() {
  const BuyMeCoffee = await ethers.getContractFactory("BuyMeCoffee");
  const buyCoffee = await BuyMeCoffee.deploy();

  await buyCoffee.deployed();

  console.log(`deployed to ${buyCoffee.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
