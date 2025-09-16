# StaticFruit Contracts Testing

This directory contains tests for the StaticFruit smart contracts deployed on Base mainnet. Tests are designed to validate contract functionality without modifying the live contracts.

## Test Types

### Live Read-Only Tests (`test:live`)
- Connect directly to Base mainnet via RPC.
- Perform only read operations (view functions, static calls).
- Validate contract metadata, interfaces, and existing state.
- **No state changes** - safe to run anytime.

### Mainnet Fork Tests (`test:fork`)
- Fork Base mainnet state using Hardhat.
- Simulate stateful operations (minting, withdrawing) on the fork.
- Impersonate contract owner for admin functions.
- **No mainnet writes** - all changes are local to the fork.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Populate `.env` with actual values:
   - `BASE_MAINNET_RPC`: Your Base mainnet RPC endpoint (e.g., Alchemy or Infura).
   - `STATICFRUIT_ADDR`: Deployed StaticFruitDeliciousAnimated address.
   - `STATICSEEDS_ADDR`: Deployed StaticSeeds address.
   - `STATICFRUIT_SAMPLE_TOKENID`: Optional, a known minted tokenId for live tests.
   - `CMC_API_KEY`: Optional, for gas reporting in USD.

## Running Tests

Install dependencies:
```bash
pnpm install
```

Compile contracts:
```bash
pnpm run compile
```

Run live read-only tests:
```bash
pnpm run test:live
```

Run fork tests:
```bash
pnpm run test:fork
```

Run all tests:
```bash
pnpm run test
```

Run coverage:
```bash
pnpm run coverage
```

Run gas report:
```bash
pnpm run gas-report
```

## CI Setup

GitHub Actions workflow (`.github/workflows/contracts-tests.yml`) runs on Node 22.x with pnpm.

Required secrets in GitHub repo:
- `BASE_MAINNET_RPC`: Base mainnet RPC URL.
- `STATICFRUIT_ADDR`: StaticFruit contract address.
- `STATICSEEDS_ADDR`: StaticSeeds contract address.
- `STATICFRUIT_SAMPLE_TOKENID`: Optional sample tokenId.

The workflow:
- Installs Node 22.x and pnpm.
- Caches pnpm dependencies.
- Runs live read-only tests.
- Runs fork tests.
- Uploads coverage artifacts.

## Safety Notes

- **Live tests**: Only read from mainnet. No transactions sent.
- **Fork tests**: All operations are simulated on a local fork. No mainnet state is modified.
- **Impersonation**: Owner impersonation is used only on the fork for testing admin functions.
- **No contract changes**: Tests validate existing deployed contracts without redeployment.

## Test Coverage

### StaticFruitDeliciousAnimated (ERC721 + ERC2981)
- **Live**: name/symbol, supportsInterface, royaltyInfo, tokenURI, deliciousnessOf.
- **Fork**: mint (qty/price checks), toggleMint (owner only), withdraw (balance transfer).

### StaticSeeds (ERC1155)
- **Live**: uri, sign/tokenId mappings, constants (MINT_PRICE, MAX_SUPPLY_PER_SIGN).
- **Fork**: mintSeed (payment/sign/supply/cap checks), claimHoroscope (burn), withdraw (owner only).

## Troubleshooting

- **RPC Issues**: Ensure `BASE_MAINNET_RPC` is valid and has sufficient rate limits.
- **Fork Timeout**: Fork tests may take longer; increase Mocha timeout if needed.
- **TypeChain Errors**: Run `pnpm run compile` to regenerate types after contract changes.
- **Env Missing**: Tests skip if required env vars are not set.