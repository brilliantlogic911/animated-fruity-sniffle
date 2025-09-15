import { run, ethers } from "hardhat";
import fs from "fs";

async function main() {
  console.log("Generating Solidity standard JSON input for verification...");

  // Get the deployed contract addresses
  // These are the addresses from our successful deployment
  const staticFruitNFTAddress = "0x26A13bfDBA3B65337f9D4821B3b10d4b651af154";
  const staticSeedsAddress = "0xF6167EEC6C79849BcFb6a952d16c5509af5209e7";

  // Generate standard JSON input for StaticFruitDeliciousAnimated contract
  console.log("Generating JSON input for StaticFruitDeliciousAnimated...");
  try {
    const standardJsonInput = await run("verify:get-verification-submissions", {
      address: staticFruitNFTAddress,
      constructorArguments: [],
      libraries: {}
    });
    
    fs.writeFileSync(
      "staticfruit-nft-verification.json",
      JSON.stringify(standardJsonInput, null, 2)
    );
    console.log("Generated staticfruit-nft-verification.json");
  } catch (error) {
    console.error("Error generating JSON input for StaticFruitDeliciousAnimated:", error);
  }

  // Generate standard JSON input for StaticSeeds contract
  console.log("Generating JSON input for StaticSeeds...");
  try {
    const standardJsonInput = await run("verify:get-verification-submissions", {
      address: staticSeedsAddress,
      constructorArguments: [staticSeedsAddress], // StaticSeeds constructor takes the owner address
      libraries: {}
    });
    
    fs.writeFileSync(
      "staticseeds-verification.json",
      JSON.stringify(standardJsonInput, null, 2)
    );
    console.log("Generated staticseeds-verification.json");
  } catch (error) {
    console.error("Error generating JSON input for StaticSeeds:", error);
  }

  console.log("Verification JSON generation completed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});