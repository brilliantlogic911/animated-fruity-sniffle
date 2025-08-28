// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title StaticSeeds
 * @dev ERC1155 token for StaticFruit seeds with horoscope-based minting
 */
contract StaticSeeds is ERC1155, Ownable, ReentrancyGuard {
    // Token IDs for different zodiac signs
    mapping(string => uint256) public signToTokenId;
    mapping(uint256 => string) public tokenIdToSign;

    // Minting configuration
    uint256 public constant MAX_SUPPLY_PER_SIGN = 10000;
    uint256 public constant MINT_PRICE = 0.01 ether;

    // Tracking
    mapping(uint256 => uint256) public totalSupply;
    mapping(address => mapping(uint256 => uint256)) public userMints;

    // Events
    event SeedMinted(address indexed user, uint256 indexed tokenId, string sign, uint256 amount);
    event HoroscopeClaimed(address indexed user, uint256 indexed tokenId, string theme);

    constructor()
        ERC1155("https://staticfruit.xyz/api/metadata/{id}.json")
    {
        // Initialize zodiac signs
        _initializeZodiacSigns();
    }

    function _initializeZodiacSigns() internal {
        string[12] memory signs = [
            "aries", "taurus", "gemini", "cancer",
            "leo", "virgo", "libra", "scorpio",
            "sagittarius", "capricorn", "aquarius", "pisces"
        ];

        for (uint256 i = 0; i < signs.length; i++) {
            uint256 tokenId = i + 1;
            signToTokenId[signs[i]] = tokenId;
            tokenIdToSign[tokenId] = signs[i];
        }
    }

    /**
     * @dev Mint seeds based on horoscope
     * @param sign Zodiac sign
     * @param amount Amount to mint
     */
    function mintSeed(string calldata sign, uint256 amount)
        external
        payable
        nonReentrant
    {
        uint256 tokenId = signToTokenId[sign];
        require(tokenId != 0, "Invalid zodiac sign");
        require(msg.value >= MINT_PRICE * amount, "Insufficient payment");
        require(totalSupply[tokenId] + amount <= MAX_SUPPLY_PER_SIGN, "Exceeds max supply");
        require(userMints[msg.sender][tokenId] + amount <= 10, "Max 10 per user per sign");

        totalSupply[tokenId] += amount;
        userMints[msg.sender][tokenId] += amount;

        _mint(msg.sender, tokenId, amount, "");

        emit SeedMinted(msg.sender, tokenId, sign, amount);
    }

    /**
     * @dev Claim horoscope reading (burns seed)
     * @param tokenId Token ID to burn
     * @param theme Generated horoscope theme
     */
    function claimHoroscope(uint256 tokenId, string calldata theme)
        external
        nonReentrant
    {
        require(balanceOf(msg.sender, tokenId) > 0, "No seeds to claim");

        _burn(msg.sender, tokenId, 1);

        emit HoroscopeClaimed(msg.sender, tokenId, theme);
    }

    /**
     * @dev Get token URI for metadata
     * @param tokenId Token ID
     * @return URI string
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory baseURI = super.uri(tokenId);
        return string(abi.encodePacked(baseURI, Strings.toString(tokenId)));
    }

    /**
     * @dev Withdraw contract funds
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Get zodiac sign for token ID
     * @param tokenId Token ID
     * @return Zodiac sign string
     */
    function getSign(uint256 tokenId) external view returns (string memory) {
        return tokenIdToSign[tokenId];
    }

    /**
     * @dev Get token ID for zodiac sign
     * @param sign Zodiac sign
     * @return Token ID
     */
    function getTokenId(string calldata sign) external view returns (uint256) {
        return signToTokenId[sign];
    }
}