const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReputationRegistry", function () {
  let registry;
  let owner;
  let loanEscrow;
  let attacker;
  let borrower;

  beforeEach(async function () {
    [owner, loanEscrow, attacker, borrower] = await ethers.getSigners();

    const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
    registry = await ReputationRegistry.deploy();
    await registry.waitForDeployment();
  });

  it("should allow setting LoanEscrow contract only once", async function () {
    await registry.setLoanEscrowContract(loanEscrow.address);

    await expect(
      registry.setLoanEscrowContract(attacker.address)
    ).to.be.reverted;
  });

  it("should NOT allow non-LoanEscrow address to flag borrower", async function () {
    await registry.setLoanEscrowContract(loanEscrow.address);

    await expect(
      registry.connect(attacker).flagBorrower(borrower.address)
    ).to.be.reverted;
  });

  it("should allow LoanEscrow to flag borrower", async function () {
    await registry.setLoanEscrowContract(loanEscrow.address);

    await registry.connect(loanEscrow).flagBorrower(borrower.address);

    const isFlagged = await registry.isBorrowerFlagged(borrower.address);
    expect(isFlagged).to.equal(true);
  });

  it("should NOT allow borrower to be flagged twice", async function () {
    await registry.setLoanEscrowContract(loanEscrow.address);

    await registry.connect(loanEscrow).flagBorrower(borrower.address);

    await expect(
      registry.connect(loanEscrow).flagBorrower(borrower.address)
    ).to.be.reverted;
  });

  it("should permanently mark borrower as not clean after default", async function () {
    await registry.setLoanEscrowContract(loanEscrow.address);

    await registry.connect(loanEscrow).flagBorrower(borrower.address);

    const isClean = await registry.isBorrowerClean(borrower.address);
    expect(isClean).to.equal(false);
  });
});
