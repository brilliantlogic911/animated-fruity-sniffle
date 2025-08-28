import { ethers } from "hardhat";

async function main() {
  console.log("Deploying StaticFruit contracts...");

  // Deploy StaticSeeds
  const StaticSeeds = await ethers.getContractFactory("StaticSeeds");
  const staticSeeds = await StaticSeeds.deploy();

  await staticSeeds.deployed();

  console.log("StaticSeeds deployed to:", staticSeeds.address);

  // You can add more contract deployments here
  // const JuiceBars = await ethers.getContractFactory("JuiceBars");
  // const juiceBars = await JuiceBars.deploy();
  // await juiceBars.deployed();
  // console.log("JuiceBars deployed to:", juiceBars.address);

  // Save deployment addresses
  const deploymentInfo = {
    staticSeeds: staticSeeds.address,
    // juiceBars: juiceBars.address,
    network: network.name,
    timestamp: new Date().toISOString(),
  };

  console.log("Deployment completed:", deploymentInfo);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});