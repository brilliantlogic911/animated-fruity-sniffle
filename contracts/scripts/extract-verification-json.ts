import fs from "fs";
import path from "path";

async function main() {
  console.log("Extracting Solidity standard JSON input for each contract...");

  // Read the build info file
  const buildInfoPath = path.join(__dirname, "..", "artifacts", "build-info", "a915dbe37e7d33b888058e0112b45614.json");
  const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, "utf8"));

  // Extract information for StaticFruitDeliciousAnimated contract
  console.log("Extracting JSON input for StaticFruitDeliciousAnimated...");
  try {
    // Create a minimal standard JSON input for StaticFruitDeliciousAnimated
    const staticFruitNFTInput = {
      language: buildInfo.language,
      sources: {
        "contracts/StaticFruitDeliciousAnimated.sol": {
          content: buildInfo.sources["contracts/StaticFruitDeliciousAnimated.sol"].content
        }
      },
      settings: buildInfo.settings
    };

    fs.writeFileSync(
      path.join(__dirname, "..", "staticfruit-nft-verification.json"),
      JSON.stringify(staticFruitNFTInput, null, 2)
    );
    console.log("Generated staticfruit-nft-verification.json");
  } catch (error) {
    console.error("Error extracting JSON input for StaticFruitDeliciousAnimated:", error);
  }

  // Extract information for StaticSeeds contract
  console.log("Extracting JSON input for StaticSeeds...");
  try {
    // Create a minimal standard JSON input for StaticSeeds
    const staticSeedsInput = {
      language: buildInfo.language,
      sources: {
        "contracts/StaticSeeds.sol": {
          content: buildInfo.sources["contracts/StaticSeeds.sol"].content
        }
      },
      settings: buildInfo.settings
    };

    fs.writeFileSync(
      path.join(__dirname, "..", "staticseeds-verification.json"),
      JSON.stringify(staticSeedsInput, null, 2)
    );
    console.log("Generated staticseeds-verification.json");
  } catch (error) {
    console.error("Error extracting JSON input for StaticSeeds:", error);
  }

  console.log("Verification JSON extraction completed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});