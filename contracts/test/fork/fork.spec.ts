import { expect } from "chai";
import { ethers, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { StaticFruitDeliciousAnimated__factory, StaticSeeds__factory } from "../../typechain";

const ERC2981_INTERFACE_ID = "0x2a55205a";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var ${name}`);
  return v;
}

describe("Mainnet fork tests (stateful simulations)", function () {
  this.timeout(300000); // 5 min for fork setup

  const fruitAddr = process.env.STATICFRUIT_ADDR;
  const seedsAddr = process.env.STATICSEEDS_ADDR;
  const canRun = !!fruitAddr && !!seedsAddr && process.env.FORK_MAINNET === "1";

  async function setupFork() {
    // Ensure we're on a fork
    if (network.name !== "hardhat") throw new Error("Fork tests require hardhat network with forking");

    const nft = StaticFruitDeliciousAnimated__factory.connect(requireEnv("STATICFRUIT_ADDR"), ethers.provider);
    const seeds = StaticSeeds__factory.connect(requireEnv("STATICSEEDS_ADDR"), ethers.provider);

    // Get owner from contract
    const ownerAddr = await nft.owner();
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [ownerAddr],
    });
    const owner = await ethers.getSigner(ownerAddr);

    // Fund owner if needed
    await network.provider.send("hardhat_setBalance", [ownerAddr, ethers.parseEther("10").toString()]);

    const user = (await ethers.getSigners())[0];

    return { nft, seeds, owner, user };
  }

  (canRun ? describe : describe.skip)("StaticFruitDeliciousAnimated fork simulations", function () {
    it("simulates minting with valid qty and payment, increments nextId, emits Mint", async function () {
      const { nft, user } = await loadFixture(setupFork);

      const initialNextId = await nft.nextId();
      const mintPrice = await nft.mintPrice();
      const qty = 2n;
      const totalCost = mintPrice * qty;

      await expect(nft.connect(user).mint(qty, { value: totalCost }))
        .to.emit(nft, "Transfer")
        .withArgs(ethers.ZeroAddress, user.address, initialNextId)
        .and.to.emit(nft, "Transfer")
        .withArgs(ethers.ZeroAddress, user.address, initialNextId + 1n);

      expect(await nft.nextId()).to.eq(initialNextId + qty);
      expect(await nft.ownerOf(initialNextId)).to.eq(user.address);
    });

    it("reverts mint when insufficient payment", async function () {
      const { nft, user } = await loadFixture(setupFork);

      const mintPrice = await nft.mintPrice();
      await expect(nft.connect(user).mint(1, { value: mintPrice - 1n })).to.be.revertedWith("Insufficient payment");
    });

    it("reverts mint when qty out of bounds (0 or >5)", async function () {
      const { nft, user } = await loadFixture(setupFork);

      const mintPrice = await nft.mintPrice();
      await expect(nft.connect(user).mint(0, { value: 0 })).to.be.reverted;
      await expect(nft.connect(user).mint(6, { value: mintPrice * 6n })).to.be.reverted;
    });

    it("reverts mint when sold out (nextId > maxSupply)", async function () {
      const { nft, user, owner } = await loadFixture(setupFork);

      const maxSupply = await nft.maxSupply();
      const currentNextId = await nft.nextId();

      if (currentNextId <= maxSupply) {
        // Simulate reaching max supply by minting remaining
        const remaining = maxSupply - currentNextId + 1n;
        const mintPrice = await nft.mintPrice();
        await nft.connect(user).mint(remaining, { value: mintPrice * remaining });
      }

      await expect(nft.connect(user).mint(1, { value: await nft.mintPrice() })).to.be.revertedWith("Sold out");
    });

    it("toggles minting only by owner", async function () {
      const { nft, owner, user } = await loadFixture(setupFork);

      const initialMintOpen = await nft.mintOpen();
      await expect(nft.connect(owner).toggleMint()).to.not.be.reverted;
      expect(await nft.mintOpen()).to.eq(!initialMintOpen);

      await expect(nft.connect(user).toggleMint()).to.be.revertedWith("OwnableUnauthorizedAccount");
    });

    it("withdraws full balance to payout address, emits Withdrawal", async function () {
      const { nft, owner, user } = await loadFixture(setupFork);

      // First, mint some to have balance
      const mintPrice = await nft.mintPrice();
      await nft.connect(user).mint(1, { value: mintPrice });

      const initialBalance = await ethers.provider.getBalance(await nft.payout());
      const contractBalance = await ethers.provider.getBalance(await nft.getAddress());

      await expect(nft.connect(owner).withdraw())
        .to.emit(nft, "Withdrawal")
        .withArgs(await nft.payout(), contractBalance);

      expect(await ethers.provider.getBalance(await nft.payout())).to.eq(initialBalance + contractBalance);
      expect(await ethers.provider.getBalance(await nft.getAddress())).to.eq(0);
    });
  });

  (canRun ? describe : describe.skip)("StaticSeeds fork simulations", function () {
    it("simulates mintSeed with valid sign, payment, and amount, emits SeedMinted", async function () {
      const { seeds, user } = await loadFixture(setupFork);

      const sign = "aries";
      const amount = 2n;
      const mintPrice = await seeds.MINT_PRICE();
      const totalCost = mintPrice * amount;

      const initialSupply = await seeds.totalSupply(1); // aries tokenId=1

      await expect(seeds.connect(user).mintSeed(sign, amount, { value: totalCost }))
        .to.emit(seeds, "SeedMinted")
        .withArgs(user.address, 1n, sign, amount);

      expect(await seeds.totalSupply(1)).to.eq(initialSupply + amount);
      expect(await seeds.balanceOf(user.address, 1)).to.eq(amount);
    });

    it("reverts mintSeed when invalid sign", async function () {
      const { seeds, user } = await loadFixture(setupFork);

      await expect(seeds.connect(user).mintSeed("invalid", 1, { value: await seeds.MINT_PRICE() })).to.be.revertedWith("Invalid zodiac sign");
    });

    it("reverts mintSeed when insufficient payment", async function () {
      const { seeds, user } = await loadFixture(setupFork);

      const mintPrice = await seeds.MINT_PRICE();
      await expect(seeds.connect(user).mintSeed("aries", 1, { value: mintPrice - 1n })).to.be.revertedWith("Insufficient payment");
    });

    it("reverts mintSeed when exceeds per-user cap", async function () {
      const { seeds, user } = await loadFixture(setupFork);

      const sign = "aries";
      const mintPrice = await seeds.MINT_PRICE();
      // Mint max per user (10)
      await seeds.connect(user).mintSeed(sign, 10, { value: mintPrice * 10n });

      await expect(seeds.connect(user).mintSeed(sign, 1, { value: mintPrice })).to.be.revertedWith("Max 10 per user per sign");
    });

    it("reverts mintSeed when exceeds max supply per sign", async function () {
      const { seeds, user } = await loadFixture(setupFork);

      // This would require minting 10000, which is impractical; assume supply is not max for test
      // In real scenario, check if totalSupply + amount > MAX_SUPPLY_PER_SIGN
      const maxSupply = await seeds.MAX_SUPPLY_PER_SIGN();
      const currentSupply = await seeds.totalSupply(1); // aries
      if (currentSupply < maxSupply) {
        const amount = maxSupply - currentSupply + 1n;
        const mintPrice = await seeds.MINT_PRICE();
        await expect(seeds.connect(user).mintSeed("aries", amount, { value: mintPrice * amount })).to.be.revertedWith("Exceeds max supply");
      }
    });

    it("simulates claimHoroscope burns token and emits Claimed", async function () {
      const { seeds, user } = await loadFixture(setupFork);

      // First mint
      const mintPrice = await seeds.MINT_PRICE();
      await seeds.connect(user).mintSeed("aries", 1, { value: mintPrice });

      await expect(seeds.connect(user).claimHoroscope(1, "test theme"))
        .to.emit(seeds, "HoroscopeClaimed")
        .withArgs(user.address, 1n, "test theme");

      expect(await seeds.balanceOf(user.address, 1)).to.eq(0);
    });

    it("reverts claimHoroscope when no balance", async function () {
      const { seeds, user } = await loadFixture(setupFork);

      await expect(seeds.connect(user).claimHoroscope(1, "theme")).to.be.revertedWith("No seeds to claim");
    });

    it("withdraws full balance to owner, emits Withdrawal", async function () {
      const { seeds, owner, user } = await loadFixture(setupFork);

      // Mint to have balance
      const mintPrice = await seeds.MINT_PRICE();
      await seeds.connect(user).mintSeed("aries", 1, { value: mintPrice });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      const contractBalance = await ethers.provider.getBalance(await seeds.getAddress());

      await expect(seeds.connect(owner).withdraw())
        .to.emit(seeds, "Withdrawal")
        .withArgs(owner.address, contractBalance);

      expect(await ethers.provider.getBalance(owner.address)).to.eq(initialBalance + contractBalance);
      expect(await ethers.provider.getBalance(await seeds.getAddress())).to.eq(0);
    });
  });
});