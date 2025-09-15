import fs from "fs";
import path from "path";

// Function to get the contract artifact and create standard JSON input
async function createVerificationJSON() {
  console.log("Creating Solidity standard JSON input for each contract...");

  // Get the build info
  const buildInfoDir = path.join(__dirname, "..", "artifacts", "build-info");
  const buildInfoFiles = fs.readdirSync(buildInfoDir);
  
  if (buildInfoFiles.length === 0) {
    console.error("No build info files found");
    return;
  }
  
  const buildInfoPath = path.join(buildInfoDir, buildInfoFiles[0]);
  const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, "utf8"));
  
  // Get the sources from build info
  const sources = buildInfo.input.sources;
  
  // Create standard JSON input for StaticFruitDeliciousAnimated
  console.log("Creating JSON input for StaticFruitDeliciousAnimated...");
  try {
    const staticFruitNFTSources: Record<string, { content: string }> = {};
    
    // Include the main contract and its dependencies
    for (const sourcePath in sources) {
      if (sourcePath.includes("StaticFruitDeliciousAnimated.sol") || 
          sourcePath.includes("@openzeppelin/contracts")) {
        staticFruitNFTSources[sourcePath] = sources[sourcePath];
      }
    }
    
    const staticFruitNFTInput = {
      language: buildInfo.input.language,
      sources: staticFruitNFTSources,
      settings: buildInfo.input.settings
    };
    
    fs.writeFileSync(
      path.join(__dirname, "..", "staticfruit-nft-verification.json"),
      JSON.stringify(staticFruitNFTInput, null, 2)
    );
    console.log("Generated staticfruit-nft-verification.json");
  } catch (error) {
    console.error("Error creating JSON input for StaticFruitDeliciousAnimated:", error);
  }
  
  // Create standard JSON input for StaticSeeds
  console.log("Creating JSON input for StaticSeeds...");
  try {
    const staticSeedsSources: Record<string, { content: string }> = {};
    
    // Include the main contract and its dependencies
    for (const sourcePath in sources) {
      if (sourcePath.includes("StaticSeeds.sol") || 
          sourcePath.includes("@openzeppelin/contracts")) {
        staticSeedsSources[sourcePath] = sources[sourcePath];
      }
    }
    
    const staticSeedsInput = {
      language: buildInfo.input.language,
      sources: staticSeedsSources,
      settings: buildInfo.input.settings
    };
    
    fs.writeFileSync(
      path.join(__dirname, "..", "staticseeds-verification.json"),
      JSON.stringify(staticSeedsInput, null, 2)
    );
    console.log("Generated staticseeds-verification.json");
  } catch (error) {
    console.error("Error creating JSON input for StaticSeeds:", error);
  }
  
  console.log("Verification JSON creation completed.");
}

createVerificationJSON().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});