# StaticFruit Test Deployment README

This document contains the details of the successful test deployment of StaticFruit smart contracts to the Base Sepolia testnet.

## 📦 Compiler Information

### StaticFruitDeliciousAnimated.sol
- **Solidity Version**: 0.8.24
- **License**: MIT
- **EVM Version**: paris
- **Compiler Settings**:
  - Optimizer: Enabled (runs: 200)
  - viaIR: Enabled

### StaticSeeds.sol
- **Solidity Version**: 0.8.20
- **License**: MIT
- **EVM Version**: paris
- **Compiler Settings**:
  - Optimizer: Enabled (runs: 200)
  - viaIR: Enabled

##  Deployment Information

### StaticFruitDeliciousAnimated.sol (ERC-721 NFT)
- **Contract Address**: `0x8Ba696bA317c3f4Ae4C94740A2f525846C3620a7`
- **Standard**: ERC-721 + ERC-2981 (Royalties)
- **Network**: Base Sepolia (Chain ID: 84532)
- **Deployer**: `0x39f843E814F6C291E46b6b0F145acEE235F4f2Ab`
- **Deployment Timestamp**: 2025-09-15T12:07:22.099Z

#### Features:
- On-chain animated SVG generation
- 8 fruit flavors with unique palettes
- Tier-based shapes (Raw, Tangy, Juicy, Prime, Legendary)
- Deliciousness scoring (0-100)
- 5% royalties (500 basis points)
- Max supply: 10,000 tokens
- Mint price: 0.01 ETH

### StaticSeeds.sol (ERC-1155 Tokens)
- **Contract Address**: `0xBCd70947123Fa61Fc0D744539A28BcbE42E05B5b`
- **Standard**: ERC-1155
- **Network**: Base Sepolia (Chain ID: 84532)
- **Deployer**: `0x39f843E814F6C291E46b6b0F145acEE235F4f2Ab`
- **Deployment Timestamp**: 2025-09-15T12:07:22.099Z

#### Features:
- Zodiac sign-based minting
- Horoscope claiming mechanism
- 10,000 max supply per sign
- 0.01 ETH mint price
- 10 mint limit per user per sign

## 🔍 Verification

You can verify the deployment on BaseScan:
- [NFT Contract on BaseScan](https://sepolia.basescan.org/address/0x8Ba696bA317c3f4Ae4C94740A2f525846C3620a7)
- [Seeds Contract on BaseScan](https://sepolia.basescan.org/address/0xBCd70947123Fa61Fc0D744539A28BcbE42E05B5b)

## 🧪 Testing Instructions

### Minting NFTs
To mint a StaticFruit Delicious Animated NFT:
1. Connect to Base Sepolia network
2. Call the `mint(uint256 qty)` function on `0x8Ba696bA317c3f4Ae4C94740A2f525846C3620a7`
3. Send 0.01 ETH * qty as the transaction value
4. Mint up to 5 tokens per transaction

### Minting Seeds
To mint StaticSeeds:
1. Connect to Base Sepolia network
2. Call the `mintSeed(string calldata sign, uint256 amount)` function on `0xBCd70947123Fa61Fc0D744539A28BcbE42E05B5b`
3. Valid zodiac signs: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces
4. Send 0.01 ETH * amount as the transaction value
5. Maximum 10 mints per user per sign

### Claiming Horoscopes
To claim a horoscope from seeds:
1. Ensure you have at least one seed of the desired zodiac sign
2. Call the `claimHoroscope(uint256 tokenId, string calldata theme)` function
3. The seed will be burned and a horoscope claimed

## 🛠️ Admin Functions

### StaticFruitDeliciousAnimated.sol
- `toggleMint(bool open)` - Enable/disable minting (onlyOwner)
- `setMintPrice(uint256 p)` - Set mint price (onlyOwner)
- `setPayout(address p)` - Set payout address (onlyOwner)
- `setBranding(string calldata _brand, string calldata _collection)` - Set brand/collection names (onlyOwner)
- `withdraw()` - Withdraw contract funds (onlyOwner)

### StaticSeeds.sol
- `withdraw()` - Withdraw contract funds (onlyOwner)

## 📈 Contract Events

### StaticFruitDeliciousAnimated.sol
- `MintToggled(bool open)`
- `MintPriceUpdated(uint256 newPrice)`
- `PayoutAddressUpdated(address newPayout)`
- `BrandingUpdated(string newBrand, string newCollection)`
- `Withdrawal(address indexed to, uint256 amount)`

### StaticSeeds.sol
- `SeedMinted(address indexed user, uint256 indexed tokenId, string sign, uint256 amount)`
- `HoroscopeClaimed(address indexed user, uint256 indexed tokenId, string theme)`
- `Withdrawal(address indexed to, uint256 amount)`

## 🧼 Security Features

Both contracts have been enhanced with:
- ReentrancyGuard protection
- Address.sendValue for ETH transfers
- Comprehensive event logging
- Proper access control with onlyOwner modifiers
- Input validation and bounds checking

## 📞 Support

For any issues or questions about the deployed contracts, please contact the development team.