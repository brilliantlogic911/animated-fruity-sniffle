# StaticFruit Smart Contracts - Security Audit

## Overview

This document provides a comprehensive security audit of the StaticFruit smart contracts, including both the `StaticFruitDeliciousAnimated.sol` (ERC-721) and `StaticSeeds.sol` (ERC-1155) contracts. The audit covers potential vulnerabilities, code quality issues, and recommendations for improvements.

## 1. StaticFruitDeliciousAnimated.sol (ERC-721 NFT Contract)

### Security Analysis

#### Re-entrancy
- **Status**: LOW RISK
- **Analysis**: The contract uses the Checks-Effects-Interactions pattern correctly. The only external call is in the `mint` function for payout, which happens after all state changes. The `withdraw` function also follows this pattern.
- **Recommendation**: Consider using `ReentrancyGuard` for additional protection, especially if more external calls are added in the future.

#### Access Control
- **Status**: GOOD
- **Analysis**: All sensitive functions (`toggleMint`, `setMintPrice`, `setPayout`, `setBranding`, `withdraw`) are protected with `onlyOwner` modifier.
- **Recommendation**: None needed.

#### Integer Overflow/Underflow
- **Status**: GOOD
- **Analysis**: Using Solidity 0.8.24 which has built-in overflow/underflow protection.
- **Recommendation**: None needed.

#### Denial of Service (DoS)
- **Status**: LOW RISK
- **Analysis**: The mint function limits qty to 5 per transaction, preventing excessive gas usage. There are no unbounded loops.
- **Recommendation**: Consider adding a circuit breaker pattern for emergency stops.

#### Front-Running
- **Status**: LOW RISK
- **Analysis**: Minting is on a first-come-first-served basis, but there's no significant advantage to front-running since token IDs are sequential.
- **Recommendation**: None needed for current implementation.

#### External Calls
- **Status**: GOOD
- **Analysis**: The only external call is in the `mint` and `withdraw` functions, which use a low-level call with proper error handling.
- **Recommendation**: Consider using `Address.sendValue` from OpenZeppelin for more robust ETH transfers.

#### Timestamp Dependence
- **Status**: GOOD
- **Analysis**: No functions rely on `block.timestamp`.
- **Recommendation**: None needed.

#### Delegated Call
- **Status**: NOT APPLICABLE
- **Analysis**: The contract does not use `delegatecall`.
- **Recommendation**: None needed.

### Gas Efficiency

#### Storage vs. Memory
- **Status**: GOOD
- **Analysis**: Function parameters and local variables are properly using `memory` and `calldata` where appropriate.
- **Recommendation**: None needed.

#### State Variable Initialization
- **Status**: GOOD
- **Analysis**: State variables are not unnecessarily initialized with default values.
- **Recommendation**: None needed.

#### Loop Optimization
- **Status**: GOOD
- **Analysis**: There are no loops that could become problematic.
- **Recommendation**: None needed.

#### Sizing Data Types
- **Status**: GOOD
- **Analysis**: Using appropriate data types (`uint8` for scores, `uint256` for IDs and supply).
- **Recommendation**: None needed.

### Code Logic and Design

#### Function Visibility
- **Status**: GOOD
- **Analysis**: All functions and state variables have appropriate visibility modifiers.
- **Recommendation**: None needed.

#### Correctness and Assumptions
- **Status**: GOOD
- **Analysis**: The contract behaves as expected for an NFT minting contract with on-chain SVG generation.
- **Recommendation**: Consider adding more comprehensive tests for edge cases.

#### Event Logging
- **Status**: LOW
- **Analysis**: Only basic events are emitted. Consider adding events for admin functions.
- **Recommendation**: Add events for `toggleMint`, `setMintPrice`, `setPayout`, and `setBranding`.

#### Edge Cases
- **Status**: GOOD
- **Analysis**: The contract handles zero values and maximum limits appropriately.
- **Recommendation**: Add explicit checks for `mintPrice` being set to zero if that's not intended.

#### Upgradeability
- **Status**: NOT APPLICABLE
- **Analysis**: The contract is not upgradeable.
- **Recommendation**: None needed.

#### Code Clarity and Comments
- **Status**: GOOD
- **Analysis**: The code is well-commented and easy to read.
- **Recommendation**: None needed.

### Token Standard Compliance

#### ERC721/ERC1155
- **Status**: GOOD
- **Analysis**: The contract properly implements ERC-721 and ERC-2981 standards.
- **Recommendation**: None needed.

#### Metadata
- **Status**: GOOD
- **Analysis**: Token metadata is generated on-chain and properly formatted.
- **Recommendation**: None needed.

## 2. StaticSeeds.sol (ERC-1155 Contract)

### Security Analysis

#### Re-entrancy
- **Status**: GOOD
- **Analysis**: The contract inherits from `ReentrancyGuard` and uses the `nonReentrant` modifier on `mintSeed` and `claimHoroscope` functions.
- **Recommendation**: None needed.

#### Access Control
- **Status**: GOOD
- **Analysis**: Sensitive functions (`withdraw`) are protected with `onlyOwner` modifier.
- **Recommendation**: None needed.

#### Integer Overflow/Underflow
- **Status**: GOOD
- **Analysis**: Using Solidity 0.8.20 which has built-in overflow/underflow protection.
- **Recommendation**: None needed.

#### Denial of Service (DoS)
- **Status**: LOW RISK
- **Analysis**: There are limits on minting (10 per user per sign) and supply (10,000 per sign), preventing excessive resource consumption.
- **Recommendation**: None needed.

#### Front-Running
- **Status**: LOW RISK
- **Analysis**: Similar to the NFT contract, there's no significant advantage to front-running.
- **Recommendation**: None needed.

#### External Calls
- **Status**: GOOD
- **Analysis**: The only external call is in the `withdraw` function, which uses a direct transfer.
- **Recommendation**: Consider using `Address.sendValue` from OpenZeppelin for more robust ETH transfers.

#### Timestamp Dependence
- **Status**: GOOD
- **Analysis**: No functions rely on `block.timestamp`.
- **Recommendation**: None needed.

#### Delegated Call
- **Status**: NOT APPLICABLE
- **Analysis**: The contract does not use `delegatecall`.
- **Recommendation**: None needed.

### Gas Efficiency

#### Storage vs. Memory
- **Status**: GOOD
- **Analysis**: Function parameters and local variables are properly using `memory` and `calldata` where appropriate.
- **Recommendation**: None needed.

#### State Variable Initialization
- **Status**: GOOD
- **Analysis**: State variables are not unnecessarily initialized with default values.
- **Recommendation**: None needed.

#### Loop Optimization
- **Status**: GOOD
- **Analysis**: The initialization loop in `_initializeZodiacSigns` is bounded and only runs once during deployment.
- **Recommendation**: None needed.

#### Sizing Data Types
- **Status**: GOOD
- **Analysis**: Using appropriate data types for the use case.
- **Recommendation**: None needed.

### Code Logic and Design

#### Function Visibility
- **Status**: GOOD
- **Analysis**: All functions and state variables have appropriate visibility modifiers.
- **Recommendation**: None needed.

#### Correctness and Assumptions
- **Status**: GOOD
- **Analysis**: The contract behaves as expected for an ERC-1155 token with minting and burning functionality.
- **Recommendation**: Consider adding more comprehensive tests for edge cases.

#### Event Logging
- **Status**: GOOD
- **Analysis**: Events are emitted for important state changes (`SeedMinted`, `HoroscopeClaimed`).
- **Recommendation**: Consider adding an event for withdrawals.

#### Edge Cases
- **Status**: GOOD
- **Analysis**: The contract handles zero values and maximum limits appropriately.
- **Recommendation**: Add explicit checks for `MINT_PRICE` being set to zero if that's not intended.

#### Upgradeability
- **Status**: NOT APPLICABLE
- **Analysis**: The contract is not upgradeable.
- **Recommendation**: None needed.

#### Code Clarity and Comments
- **Status**: GOOD
- **Analysis**: The code is well-commented and easy to read.
- **Recommendation**: None needed.

### Token Standard Compliance

#### ERC721/ERC1155
- **Status**: GOOD
- **Analysis**: The contract properly implements ERC-1155 standard.
- **Recommendation**: None needed.

#### Metadata
- **Status**: GOOD
- **Analysis**: Token metadata URI is properly implemented.
- **Recommendation**: None needed.

## Recommendations Summary

### High Priority
1. Add events for admin functions in `StaticFruitDeliciousAnimated.sol`:
   - `toggleMint`
   - `setMintPrice`
   - `setPayout`
   - `setBranding`

2. Add event for withdrawals in `StaticSeeds.sol`

### Medium Priority
1. Consider adding `ReentrancyGuard` to `StaticFruitDeliciousAnimated.sol` for additional protection
2. Use `Address.sendValue` for ETH transfers in both contracts for more robust handling
3. Add explicit checks for zero values in critical parameters if zero is not intended

### Low Priority
1. Consider adding a circuit breaker pattern for emergency stops in `StaticFruitDeliciousAnimated.sol`
2. Add more comprehensive tests for edge cases in both contracts

## Conclusion

Both contracts are well-designed and follow security best practices. The main areas for improvement are adding more comprehensive event logging and considering additional security measures like `ReentrancyGuard` and `Address.sendValue`. With the recommended changes, these contracts would be production-ready for mainnet deployment.