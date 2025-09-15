import { createPublicClient, http, Block } from "viem";
import { base } from "viem/chains";
import * as dotenv from "dotenv";

dotenv.config();

async function testBaseConnection() {
  try {
    // Use the Base mainnet RPC URL from environment variables
    const client = createPublicClient({
      chain: base,
      transport: http(process.env.ALCHEMY_URL || "https://base-mainnet.g.alchemy.com/v2/b6jbZziOU4m6bKhpn6vFCK1XoVn5fYnP"),
    });

    // Get the latest block
    const block: Block = await client.getBlock();
    
    console.log("Successfully connected to Base mainnet!");
    console.log("Latest block number:", block.number?.toString());
    console.log("Block timestamp:", new Date(Number(block.timestamp) * 1000).toISOString());
    console.log("Block hash:", block.hash);
    
    console.log("Base mainnet connection test completed successfully!");
  } catch (error) {
    console.error("Error connecting to Base mainnet:", error);
  }
}

testBaseConnection();