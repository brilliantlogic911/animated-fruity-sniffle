import { ethers, network } from "hardhat";

async function main() {
  console.log("Deploying StaticFruit contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy StaticFruit Delicious Animated NFT
  const StaticFruitDeliciousAnimated = await ethers.getContractFactory("StaticFruitDeliciousAnimated");

  // Constructor parameters:
  // royaltyBps: 500 (5%), maxSupply: 10000, mintPrice: 0.01 ETH, payout: deployer address
  const royaltyBps = 500; // 5% royalty
  const maxSupply = 10000;
  const mintPrice = ethers.parseEther("0.01"); // 0.01 ETH
  const payoutAddress = deployer.address; // Use deployer as payout address

  console.log("Deploying StaticFruit Delicious Animated...");
  console.log("Royalty BPS:", royaltyBps);
  console.log("Max Supply:", maxSupply);
  console.log("Mint Price:", ethers.formatEther(mintPrice), "ETH");
  console.log("Payout Address:", payoutAddress);

  const staticFruitNFT = await StaticFruitDeliciousAnimated.deploy(
    royaltyBps,
    maxSupply,
    mintPrice,
    payoutAddress
  );

  await staticFruitNFT.waitForDeployment();

  console.log("StaticFruit Delicious Animated deployed to:", await staticFruitNFT.getAddress());

  // Optional: Deploy StaticSeeds as well
  console.log("Deploying StaticSeeds...");
  const StaticSeeds = await ethers.getContractFactory("StaticSeeds");
  const staticSeeds = await StaticSeeds.deploy(deployer.address);
  await staticSeeds.waitForDeployment();
  console.log("StaticSeeds deployed to:", await staticSeeds.getAddress());

  // Save deployment addresses
  const deploymentInfo = {
    staticFruitNFT: await staticFruitNFT.getAddress(),
    staticSeeds: await staticSeeds.getAddress(),
    network: network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  console.log("Deployment completed:", deploymentInfo);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});