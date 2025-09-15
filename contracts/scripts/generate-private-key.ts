import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

// Generate a new private key
const privateKey = generatePrivateKey();
console.log("Generated Private Key:", privateKey);

// Get the corresponding address
const account = privateKeyToAccount(privateKey);
console.log("Corresponding Address:", account.address);