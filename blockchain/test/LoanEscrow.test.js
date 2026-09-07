const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoanEscrow", function () {
  let registry, pool, escrow;
  let borrower, lender, insurer;

  beforeEach(async function () {
    [borrower, lender, insurer] = await ethers.getSigners();

    const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
    registry = await ReputationRegistry.deploy();
    await registry.waitForDeployment();

    const InsurancePool = await ethers.getContractFactory("InsurancePool");
    pool = await InsurancePool.deploy();
    await pool.waitForDeployment();

    const LoanEscrow = await ethers.getContractFactory("LoanEscrow");
    escrow = await LoanEscrow.deploy(
      await registry.getAddress(),
      await pool.getAddress()
    );
    await escrow.waitForDeployment();

    await registry.setLoanEscrowContract(await escrow.getAddress());
    await pool.setLoanEscrowContract(await escrow.getAddress());
  });

  it("should allow borrower to create and lender to fund loan", async function () {
    await escrow.connect(borrower).createLoan(
      ethers.parseEther("1"),
      ethers.parseEther("0.1"),
      60,
      false,
      ethers.ZeroAddress
    );

    await escrow.connect(lender).fundLoan(1, {
      value: ethers.parseEther("1"),
    });

    const loan = await escrow.loans(1);
    expect(loan.lender).to.equal(lender.address);
  });

  it("should allow borrower to repay loan", async function () {
    await escrow.connect(borrower).createLoan(
      ethers.parseEther("1"),
      ethers.parseEther("0.1"),
      60,
      false,
      ethers.ZeroAddress
    );

    await escrow.connect(lender).fundLoan(1, {
      value: ethers.parseEther("1"),
    });

    await escrow.connect(borrower).repayLoan(1, {
      value: ethers.parseEther("1.1"),
    });

    const loan = await escrow.loans(1);
    expect(loan.state).to.equal(2); // REPAID
  });

  it("should default and flag borrower after deadline", async function () {
    await pool.connect(insurer).deposit({ value: ethers.parseEther("2") });

    await escrow.connect(borrower).createLoan(
      ethers.parseEther("1"),
      ethers.parseEther("0.1"),
      1,
      true,
      insurer.address
    );

    await escrow.connect(lender).fundLoan(1, {
      value: ethers.parseEther("1"),
    });

    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine");

    await escrow.markDefault(1);

    const isFlagged = await registry.isBorrowerFlagged(borrower.address);
    expect(isFlagged).to.equal(true);
  });
});
