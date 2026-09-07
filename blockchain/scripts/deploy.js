const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Deployer balance:",
    ethers.formatEther(
      await deployer.provider.getBalance(deployer.address)
    )
  );

  // ------------------------------------------------------------
  // 1. Deploy ReputationRegistry
  // ------------------------------------------------------------
  const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
  const reputationRegistry = await ReputationRegistry.deploy();
  await reputationRegistry.waitForDeployment();
  const reputationRegistryAddr = await reputationRegistry.getAddress();

  console.log("ReputationRegistry deployed at:", reputationRegistryAddr);

  // ------------------------------------------------------------
  // 2. Deploy InsurancePool
  // ------------------------------------------------------------
  const InsurancePool = await ethers.getContractFactory("InsurancePool");
  const insurancePool = await InsurancePool.deploy();
  await insurancePool.waitForDeployment();
  const insurancePoolAddr = await insurancePool.getAddress();

  console.log("InsurancePool deployed at:", insurancePoolAddr);

  // ------------------------------------------------------------
  // 3. Deploy LoanEscrow
  // ------------------------------------------------------------
  const LoanEscrow = await ethers.getContractFactory("LoanEscrow");
  const loanEscrow = await LoanEscrow.deploy(
    reputationRegistryAddr,
    insurancePoolAddr
  );
  await loanEscrow.waitForDeployment();
  const loanEscrowAddr = await loanEscrow.getAddress();

  console.log("LoanEscrow deployed at:", loanEscrowAddr);

  // ------------------------------------------------------------
  // 4. Deploy LenderLiquidityPool
  // ------------------------------------------------------------
  const LenderLiquidityPool = await ethers.getContractFactory("LenderLiquidityPool");
  const liquidityPool = await LenderLiquidityPool.deploy();
  await liquidityPool.waitForDeployment();
  const liquidityPoolAddr = await liquidityPool.getAddress();

  console.log("LenderLiquidityPool deployed at:", liquidityPoolAddr);

  // ------------------------------------------------------------
  // 5. Wire contracts together (CRITICAL)
  // ------------------------------------------------------------
  console.log("Wiring contracts...");

  // Reputation & Insurance trust LoanEscrow
  await (await reputationRegistry.setLoanEscrowContract(loanEscrowAddr)).wait();
  await (await insurancePool.setLoanEscrowContract(loanEscrowAddr)).wait();

  // LoanEscrow trusts LiquidityPool
  await (await loanEscrow.setLiquidityPool(liquidityPoolAddr)).wait();

  // FIX: LiquidityPool trusts LoanEscrow (was missing)
  await (await liquidityPool.setLoanEscrow(loanEscrowAddr)).wait();

  // LiquidityPool trusts BACKEND (protocol)
  await (await liquidityPool.setProtocol(deployer.address)).wait();

  console.log("Contracts wired successfully ✅");

  // ------------------------------------------------------------
  // 6. Summary
  // ------------------------------------------------------------
  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("ReputationRegistry :", reputationRegistryAddr);
  console.log("InsurancePool      :", insurancePoolAddr);
  console.log("LoanEscrow         :", loanEscrowAddr);
  console.log("LiquidityPool      :", liquidityPoolAddr);
  console.log("Protocol (backend) :", deployer.address);
  console.log("==========================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});