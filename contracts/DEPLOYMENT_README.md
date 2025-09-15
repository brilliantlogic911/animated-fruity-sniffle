# StaticFruit Contracts - Testnet Deployment Guide

## 🚀 Deployment Preparation Complete

Your contracts are now configured for Base Sepolia testnet deployment.

## 📋 Required Setup

### 1. Configure Environment Variables

Edit `contracts/.env` and replace the placeholder values:

```bash
# Replace with your actual private key (without 0x prefix)
PRIVATE_KEY=0xD0344B603aFaCedBdE6C02AF3c026010BC426dA7

# Optional: Separate deployer key if different from main key
DEPLOYER_PRIVATE_KEY=your_deployer_private_key_here

# Get from https://basescan.org/
BASESCAN_API_KEY=your_basescan_api_key_here
```

### 2. Fund Your Deployer Account

Make sure your deployer account (address: `0xD0344B603aFaCedBdE6C02AF3c026010BC426dA7`) has sufficient ETH on Base Sepolia testnet.

## 🛠️ Deployment Commands

### Compile Contracts
```bash
cd contracts
npx hardhat compile
```

### Deploy to Base Sepolia Testnet
```bash
npx hardhat run scripts/deploy.ts --network baseSepolia
```

### Verify Contracts on BaseScan
```bash
# Verify StaticFruit Delicious Animated
npx hardhat verify --network baseSepolia STATIC_FRUIT_NFT_ADDRESS "500" "10000" "10000000000000000" "0xD0344B603aFaCedBdE6C02AF3c026010BC426dA7"

# Verify StaticSeeds
npx hardhat verify --network baseSepolia STATIC_SEEDS_ADDRESS
```

## 📊 Contract Details

### StaticFruit Delicious Animated (Primary)
- **Contract**: StaticFruitDeliciousAnimated.sol
- **Standard**: ERC-721 + EIP-2981
- **Network**: Base Sepolia (Chain ID: 84532)
- **Features**:
  - On-chain animated SVG generation
  - Tier-based shapes (Raw, Tangy, Juicy, Prime, Legendary)
  - 8 fruit flavors with unique palettes
  - Deliciousness score (0-100) drives animations
  - Royalty support (5%)
  - Max supply: 10,000
  - Mint price: 0.01 ETH

### StaticSeeds (Secondary)
- **Contract**: StaticSeeds.sol
- **Standard**: ERC-1155
- **Features**:
  - Zodiac sign-based minting
  - Horoscope claiming mechanism
  - Owner withdrawal functionality

## 🔧 Network Configuration

The following networks are configured in `hardhat.config.ts`:

- `hardhat`: Local development network
- `base`: Base mainnet
- `baseGoerli`: Base Goerli testnet (deprecated)
- `baseSepolia`: Base Sepolia testnet (active)

## 📝 Deployment Script

The deployment script (`scripts/deploy.ts`) will:
1. Deploy the StaticSeeds contract
2. Log the deployment address
3. Save deployment information

## ⚠️ Security Notes

- Never commit your `.env` file to version control
- Use a dedicated deployment account with minimal funds
- Test thoroughly on testnet before mainnet deployment
- Verify all contract interactions work as expected

## 🎯 Next Steps

1. Configure your private keys in `.env`
2. Fund the deployer account with testnet ETH
3. Run the deployment command
4. Verify the contract on BaseScan
5. Test contract functionality