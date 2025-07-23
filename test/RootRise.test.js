import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

const { ethers } = hre;

describe("RootRise Crowdfunding Platform", function () {
  // Fixture to deploy contracts
  async function deployContractsFixture() {
    const [owner, farmer1, farmer2, investor1, investor2] = await ethers.getSigners();

    // Deploy Mock USDC
    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDCFactory.deploy(
      "Mock USD Coin",
      "USDC",
      6,
      ethers.parseUnits("1000000", 6) // 1M USDC initial supply
    );
    await mockUSDC.waitForDeployment();

    // Deploy RootRise Contract
    const RootRiseFactory = await ethers.getContractFactory("RootRiseCrowdfunding");
    const rootRise = await RootRiseFactory.deploy(await mockUSDC.getAddress());
    await rootRise.waitForDeployment();

    // Mint USDC to investors for testing
    await mockUSDC.mint(investor1.address, ethers.parseUnits("10000", 6)); // 10k USDC
    await mockUSDC.mint(investor2.address, ethers.parseUnits("5000", 6));  // 5k USDC

    return {
      rootRise,
      mockUSDC,
      owner,
      farmer1,
      farmer2,
      investor1,
      investor2
    };
  }

  describe("Contract Deployment", function () {
    it("Should deploy with correct initial values", async function () {
      const { rootRise, mockUSDC, owner } = await loadFixture(deployContractsFixture);

      expect(await rootRise.owner()).to.equal(owner.address);
      expect(await rootRise.stablecoin()).to.equal(await mockUSDC.getAddress());
      expect(await rootRise.getTotalProjects()).to.equal(0);
    });

    it("Should have correct USDC configuration", async function () {
      const { mockUSDC } = await loadFixture(deployContractsFixture);

      expect(await mockUSDC.name()).to.equal("Mock USD Coin");
      expect(await mockUSDC.symbol()).to.equal("USDC");
      expect(await mockUSDC.decimals()).to.equal(6);
    });
  });

  describe("Farmer Management", function () {
    it("Should allow owner to whitelist farmers", async function () {
      const { rootRise, farmer1 } = await loadFixture(deployContractsFixture);

      await rootRise.addFarmer(farmer1.address);
      expect(await rootRise.isFarmerWhitelisted(farmer1.address)).to.be.true;
    });

    it("Should not allow non-owners to whitelist farmers", async function () {
      const { rootRise, farmer1, farmer2 } = await loadFixture(deployContractsFixture);

      await expect(
        rootRise.connect(farmer1).addFarmer(farmer2.address)
      ).to.be.revertedWithCustomError(rootRise, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to remove farmers", async function () {
      const { rootRise, farmer1 } = await loadFixture(deployContractsFixture);

      await rootRise.addFarmer(farmer1.address);
      expect(await rootRise.isFarmerWhitelisted(farmer1.address)).to.be.true;

      await rootRise.removeFarmer(farmer1.address);
      expect(await rootRise.isFarmerWhitelisted(farmer1.address)).to.be.false;
    });
  });

  describe("Project Creation", function () {
    it("Should allow whitelisted farmers to create projects", async function () {
      const { rootRise, farmer1 } = await loadFixture(deployContractsFixture);

      await rootRise.addFarmer(farmer1.address);

      const title = "Maize Production Project";
      const goal = ethers.parseUnits("5000", 6); // 5000 USDC
      const duration = 30; // 30 days

      await expect(
        rootRise.connect(farmer1).createProject(title, goal, duration)
      ).to.emit(rootRise, "ProjectCreated");

      expect(await rootRise.getTotalProjects()).to.equal(1);

      const project = await rootRise.getProject(1);
      expect(project.farmer).to.equal(farmer1.address);
      expect(project.title).to.equal(title);
      expect(project.goal).to.equal(goal);
      expect(project.isOpen).to.be.true;
    });

    it("Should not allow non-whitelisted farmers to create projects", async function () {
      const { rootRise, farmer1 } = await loadFixture(deployContractsFixture);

      const title = "Unauthorized Project";
      const goal = ethers.parseUnits("1000", 6);
      const duration = 30;

      await expect(
        rootRise.connect(farmer1).createProject(title, goal, duration)
      ).to.be.reverted;
    });

    it("Should allow owner to create projects for farmers", async function () {
      const { rootRise, owner, farmer1 } = await loadFixture(deployContractsFixture);

      await rootRise.addFarmer(farmer1.address);

      const title = "Admin Created Project";
      const goal = ethers.parseUnits("3000", 6);
      const duration = 45;

      await expect(
        rootRise.connect(owner).createProjectForFarmer(farmer1.address, title, goal, duration)
      ).to.emit(rootRise, "ProjectCreated");

      const project = await rootRise.getProject(1);
      expect(project.farmer).to.equal(farmer1.address);
      expect(project.title).to.equal(title);
    });
  });

  describe("Contributions", function () {
    it("Should allow investors to contribute to projects", async function () {
      const { rootRise, mockUSDC, farmer1, investor1 } = await loadFixture(deployContractsFixture);

      // Setup: Create project
      await rootRise.addFarmer(farmer1.address);
      await rootRise.connect(farmer1).createProject(
        "Test Project",
        ethers.parseUnits("5000", 6),
        30
      );

      // Investor approves and contributes
      const contributionAmount = ethers.parseUnits("1000", 6); // 1000 USDC
      await mockUSDC.connect(investor1).approve(await rootRise.getAddress(), contributionAmount);

      await expect(
        rootRise.connect(investor1).contribute(1, contributionAmount)
      ).to.emit(rootRise, "ContributionMade");

      // Check contribution was recorded
      const contribution = await rootRise.getContribution(1, investor1.address);
      expect(contribution).to.equal(contributionAmount);

      // Check project amount raised
      const project = await rootRise.getProject(1);
      expect(project.amountRaised).to.equal(contributionAmount);
    });

    it("Should not allow contributions without sufficient allowance", async function () {
      const { rootRise, farmer1, investor1 } = await loadFixture(deployContractsFixture);

      await rootRise.addFarmer(farmer1.address);
      await rootRise.connect(farmer1).createProject(
        "Test Project",
        ethers.parseUnits("5000", 6),
        30
      );

      const contributionAmount = ethers.parseUnits("1000", 6);

      await expect(
        rootRise.connect(investor1).contribute(1, contributionAmount)
      ).to.be.reverted;
    });
  });
});