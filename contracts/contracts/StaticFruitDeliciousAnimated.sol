// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 * StaticFruit – Delicious NFTs (Animated)
 * - ERC-721 + EIP-2981
 * - On-chain, animated SVG with tier-specific shapes
 * - "Deliciousness" (0..100) drives visuals + animation intensity
 */

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

contract StaticFruitDeliciousAnimated is ERC721, ERC2981, ERC721Burnable, Ownable, ReentrancyGuard {
    using Strings for uint256;
    using Strings for uint8;
    using Address for address payable;

    uint256 public nextId;
    uint256 public immutable maxSupply;
    uint256 public mintPrice; // set 0 for free
    address public payout;

    string public brand = "StaticFruit";
    string public collection = "Delicious";

    bool public mintOpen = true;

    constructor(
        uint96 royaltyBps,
        uint256 _maxSupply,
        uint256 _price,
        address _payout
    ) ERC721("StaticFruit Delicious (Animated)", "FRUTX") Ownable(_payout) {
        _setDefaultRoyalty(_payout, royaltyBps);
        maxSupply = _maxSupply;
        mintPrice = _price;
        payout = _payout;
    }

    // ----- Events -----
    event MintToggled(bool open);
    event MintPriceUpdated(uint256 newPrice);
    event PayoutAddressUpdated(address newPayout);
    event BrandingUpdated(string newBrand, string newCollection);
    event Withdrawal(address indexed to, uint256 amount);

    // ----- Admin -----
    function toggleMint(bool open) external onlyOwner {
        mintOpen = open;
        emit MintToggled(open);
    }
    
    function setMintPrice(uint256 p) external onlyOwner {
        mintPrice = p;
        emit MintPriceUpdated(p);
    }
    
    function setPayout(address p) external onlyOwner {
        payout = p;
        emit PayoutAddressUpdated(p);
    }
    
    function setBranding(string calldata _brand, string calldata _collection) external onlyOwner {
        brand = _brand;
        collection = _collection;
        emit BrandingUpdated(_brand, _collection);
    }

    // ----- Mint -----
    function mint(uint256 qty) external payable nonReentrant {
        require(mintOpen, "Mint closed");
        require(qty > 0 && qty <= 5, "qty 1..5");
        require(nextId + qty <= maxSupply, "sold out");
        require(msg.value >= mintPrice * qty, "insufficient ETH");
        unchecked {
            for (uint256 i; i < qty; ++i) {
                _safeMint(msg.sender, nextId);
                ++nextId;
            }
        }
        if (address(this).balance > 0) {
            payable(payout).sendValue(address(this).balance);
        }
    }

    // ----- Traits -----
    function _seed(uint256 tokenId) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(address(this), tokenId, block.chainid));
    }

    // 0..100 (light bias upward to avoid flat lows)
    function deliciousnessOf(uint256 tokenId) public view returns (uint8) {
        require(_ownerOf(tokenId) != address(0), "NA");
        uint8 score = uint8(uint256(_seed(tokenId)) % 101);
        if (score < 8) score += 8;
        return score;
    }

    function _tier(uint8 d) internal pure returns (string memory) {
        if (d >= 90) return "Legendary";
        if (d >= 70) return "Prime";
        if (d >= 50) return "Juicy";
        if (d >= 30) return "Tangy";
        return "Raw";
    }

    function _fruitOf(uint256 tokenId) internal view returns (string memory fruit, uint8 idx) {
        string[8] memory fruits = ["Mango","Berry","Dragonfruit","Grape","Peach","Lime","Plum","Guava"];
        idx = uint8(uint256(_seed(tokenId) >> 32) % fruits.length);
        fruit = fruits[idx];
    }

    function _palette(uint8 idx, uint8 delicious) internal pure returns (string memory bg, string memory fg) {
        string[8] memory bgs = ["#0d1117","#121212","#0b0f14","#1a1020","#0f1320","#101314","#0e1117","#141016"];
        string[8] memory fgs = ["#FF7E4B","#A16BFF","#FF3FA4","#8B5CF6","#FFB86B","#7CF5C9","#9B59B6","#7FDBFF"];
        bg = bgs[idx];
        uint8 j = delicious > 66 ? (idx + 1) % 8 : delicious > 33 ? (idx + 2) % 8 : (idx + 3) % 8;
        fg = fgs[j];
    }

    // Tier-specific primary shape path centered near blob
    function _shapePath(string memory tier) internal pure returns (string memory d) {
        // Coordinates built for 1000x1000 canvas around (500,520)
        if (keccak256(bytes(tier)) == keccak256("Raw")) {
            // Triangle
            return "M500,240 L320,720 L680,720 Z";
        } else if (keccak256(bytes(tier)) == keccak256("Tangy")) {
            // Diamond
            return "M500,240 L300,520 L500,800 L700,520 Z";
        } else if (keccak256(bytes(tier)) == keccak256("Juicy")) {
            // Rounded blob (organic)
            return "M500,260 C360,300 320,560 460,720 C580,820 720,700 700,520 C680,360 640,300 500,260 Z";
        } else if (keccak256(bytes(tier)) == keccak256("Prime")) {
            // Star (5-point)
            return "M500,240 L540,420 L720,420 L580,520 L620,700 L500,600 L380,700 L420,520 L280,420 L460,420 Z";
        } else {
            // Legendary: crown-like starburst
            return "M500,240 L560,420 L720,380 L600,500 L720,620 L560,580 L500,760 L440,580 L280,620 L400,500 L280,380 L440,420 Z";
        }
    }

    // Small sparkle glyph for Prime/Legendary tiers
    function _sparklePath() internal pure returns (string memory) {
        return "M0,-20 L6,-6 L20,0 L6,6 L0,20 L-6,6 L-20,0 L-6,-6 Z";
    }

    // ----- Rendering -----
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "NA");

        (string memory fruit, uint8 idx) = _fruitOf(tokenId);
        uint8 d = deliciousnessOf(tokenId);
        (string memory bg, string memory fg) = _palette(idx, d);
        string memory tier = _tier(d);

        string memory name_ = string.concat(brand, " ", collection, " #", tokenId.toString());
        string memory desc  = string.concat(
            "A ", brand, " ", collection,
            " piece. Flavor: ", fruit,
            ". Tier: ", tier,
            ". Deliciousness: ", d.toString(), "/100. Animated on-chain SVG."
        );

        string memory svg = _svg(fruit, tier, d, bg, fg, tokenId);
        bytes memory json = abi.encodePacked(
            '{"name":"', name_,
            '","description":"', desc,
            '","image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)),
            '","attributes":[',
              '{"trait_type":"Flavor","value":"', fruit, '"},',
              '{"trait_type":"Tier","value":"', tier, '"},',
              '{"trait_type":"Deliciousness","value":', d.toString(), '}',
            ']}'
        );
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(json)));
    }

    function _svg(
        string memory fruit,
        string memory tier,
        uint8 d,
        string memory bg,
        string memory fg,
        uint256 tokenId
    ) internal view returns (string memory) {
        // Animation speeds scale with Deliciousness (faster if juicier)
        // Clamp durations to pleasant ranges.
        uint256 pulseDur = 8 - (uint256(d) / 20);    // 8..3s
        if (pulseDur < 3) pulseDur = 3;
        uint256 spinDur  = 14 - (uint256(d) / 12);   // 14..6s
        if (spinDur < 6) spinDur = 6;
        uint256 shimmerDur = 12 - (uint256(d) / 15);// 12..5s
        if (shimmerDur < 5) shimmerDur = 5;

        string memory meterW = _barWidth(d);
        string memory path   = _shapePath(tier);

        // Prime/Legendary sparkle glyph showing subtle rotation
        bool showSparkle = (keccak256(bytes(tier)) == keccak256("Prime")
                         || keccak256(bytes(tier)) == keccak256("Legendary"));

        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000">',
                '<defs>',
                  '<style>@font-face{font-family:Inter;src:local(Inter);} .t{font-family:Inter,system-ui,sans-serif;fill:#fff}</style>',

                  // Pulsing radial gradient for the juice blob
                  '<radialGradient id="g">',
                    '<stop offset="0%" stop-color="', fg, '" stop-opacity="0.95">',
                      '<animate attributeName="offset" values="0%;20%;0%" dur="', pulseDur.toString(), 's" repeatCount="indefinite"/>',
                    '</stop>',
                    '<stop offset="100%" stop-color="', fg, '" stop-opacity="0.12"/>',
                  '</radialGradient>',

                  // Shimmer gradient for the meter bar
                  '<linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">',
                    '<stop offset="0%" stop-color="#ffffff20"/>',
                    '<stop offset="50%" stop-color="#ffffff60">',
                      '<animate attributeName="offset" values="0%;100%" dur="', shimmerDur.toString(), 's" repeatCount="indefinite"/>',
                    '</stop>',
                    '<stop offset="100%" stop-color="#ffffff20"/>',
                  '</linearGradient>',
                '</defs>',

                // Backdrop
                '<rect width="100%" height="100%" rx="48" fill="', bg, '"/>',

                // Juice blob with subtle scale pulse
                '<g transform="translate(500,520)">',
                  '<g>',
                    '<circle r="360" fill="url(#g)">',
                      '<animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="', pulseDur.toString(), 's" repeatCount="indefinite"/>',
                    '</circle>',
                  '</g>',

                  // Tier-specific shape overlay
                  '<path d="', path, '" transform="translate(-500,-520)" fill="', fg, '" opacity="0.18"/>',

                  // Sparkle (Prime/Legendary)
                  showSparkle
                    ? string(
                        abi.encodePacked(
                          '<g transform="translate(0,-200)">',
                            '<path d="', _sparklePath(), '" fill="#ffffffd0">',
                              '<animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="', spinDur.toString(), 's" repeatCount="indefinite"/>',
                            '</path>',
                          '</g>'
                        )
                      )
                    : '',

                '</g>',

                // Title & token number
                '<text x="80" y="200" class="t" font-size="64" opacity="0.9">', fruit, ' - ', tier, '</text>',
                '<text x="80" y="280" class="t" font-size="36" opacity="0.6">#', tokenId.toString(), '</text>',

                // Meter label
                '<text x="80" y="700" class="t" font-size="28" opacity="0.85">Deliciousness ', d.toString(), '/100</text>',

                // Meter track + fill (with shimmer)
                '<rect x="80" y="720" width="840" height="36" rx="18" fill="#ffffff20"/>',
                '<rect x="80" y="720" width="', meterW, '" height="36" rx="18" fill="url(#shimmer)"/>',

                // Badge
                '<rect x="80" y="820" rx="14" width="840" height="56" fill="#ffffff10"/>',
                '<text x="100" y="860" class="t" font-size="28" opacity="0.9">', collection, ' - ', fruit, '</text>',

                '</svg>'
            )
        );
    }

    function _barWidth(uint8 d) internal pure returns (string memory) {
        uint256 w = (uint256(d) * 840) / 100;
        return w.toString();
    }

    // ----- 2981 / Interface -----
    function supportsInterface(bytes4 iid) public view override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(iid);
    }

    // ----- Safety -----
    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        emit Withdrawal(payout, amount);
        payable(payout).sendValue(amount);
    }
}