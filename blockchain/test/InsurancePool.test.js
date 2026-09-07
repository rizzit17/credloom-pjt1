const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsurancePool", function () {
  let pool;
  let owner;
  let loanEscrow;
  let insurer;
  let lender;
  let attacker;

  beforeEach(async function () {
    [owner, loanEscrow, insurer, lender, attacker] = await ethers.getSigners();

    const InsurancePool = await ethers.getContractFactory("InsurancePool");
    pool = await InsurancePool.deploy();
    await pool.waitForDeployment();

    await pool.setLoanEscrowContract(loanEscrow.address);
  });

  it("should allow insurer to deposit funds", async function () {
    await pool.connect(insurer).deposit({ value: ethers.parseEther("5") });

    const balance = await pool.getInsurerBalance(insurer.address);
    expect(balance).to.equal(ethers.parseEther("5"));
  });

  it("should NOT allow non-LoanEscrow to trigger payout", async function () {
    await pool.connect(insurer).deposit({ value: ethers.parseEther("5") });

    await expect(
      pool
        .connect(attacker)
        .payout(insurer.address, lender.address, ethers.parseEther("1"))
    ).to.be.reverted;
  });

  it("should allow LoanEscrow to payout lender", async function () {
    await pool.connect(insurer).deposit({ value: ethers.parseEther("5") });

    const lenderBalanceBefore = await ethers.provider.getBalance(lender.address);

    await pool
      .connect(loanEscrow)
      .payout(insurer.address, lender.address, ethers.parseEther("2"));

    const lenderBalanceAfter = await ethers.provider.getBalance(lender.address);
    expect(lenderBalanceAfter).to.be.gt(lenderBalanceBefore);
  });

  it("should NOT allow payout if insurer balance is insufficient", async function () {
    await pool.connect(insurer).deposit({ value: ethers.parseEther("1") });

    await expect(
      pool
        .connect(loanEscrow)
        .payout(insurer.address, lender.address, ethers.parseEther("2"))
    ).to.be.reverted;
  });
});
