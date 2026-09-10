# Credloom

<p align="center">
  <strong>Autonomous, Privacy-Preserving, AI-Scored, Insured Micro-Lending Marketplace</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solidity-^0.8.20-363636?style=flat-square&logo=solidity" alt="Solidity" />
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/FastAPI-0.109+-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Scikit--Learn-GBR_V2-F7931E?style=flat-square&logo=scikit-learn" alt="Scikit-Learn" />
  <img src="https://img.shields.io/badge/EVM-Hardhat-yellow?style=flat-square&logo=ethereum" alt="Hardhat" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

---

## Executive Summary

Traditional decentralized finance (DeFi) protocols (Aave, Compound, MakerDAO) mandate **150% to 200% over-collateralization**. While this protects protocols against pseudonymous defaults, it locks up billions in dead capital and completely excludes users who need capital liquidity without having excess crypto to lock.

**Credloom** introduces an **under-collateralized, reputation-first micro-credit marketplace** powered by machine-learning risk modeling, smart-contract escrow, decentralized identity verification, and tripartite insurance staking.

```
               ┌────────────────────────────────────────────────────────┐
               │                     CREDLOOM ECOSYSTEM                 │
               └────────────────────────────────────────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│     BORROWER     │             │      LENDER      │             │     INSURER      │
├──────────────────┤             ├──────────────────┤             ├──────────────────┤
│ • Requests loan  │             │ • Pre-funds pool │             │ • Stakes capital │
│ • Tier proofs    │             │ • Risk criteria  │             |   in Insurance   │
│ • Gets AI score  │             │ • Earns interest │             |   Pool           │
│ • Repays debt    │             │   yield (APR)    │             │ • Collects 100bps│
│ • Builds credit  │             │ • Capital insured│             |   yield premium  │
│   on-chain       │             │   against loss   │             │ • Covers default │
└──────────────────┘             └──────────────────┘             └──────────────────┘
```

---

## Key Pillars

1. **Reputation as Collateral**: Defaulted wallets are permanently recorded on `ReputationRegistry.sol`. Web3 wallet identity and credit history become a high-value intangible asset.
2. **AI Credit Risk Scoring**: A custom Gradient Boosting Regressor (GBR) analyzes on-chain transaction frequency, wallet holding duration, borrowing track records, and identity tiers to predict default probability and map to a $0 - 1000$ calibrated score.
3. **Dynamic APR Pricing**: Interest rates adapt dynamically between **5.0% and 25.0%** based on real-time calculated creditworthiness.
4. **Tripartite Risk Distribution**: Insurers stake capital into `InsurancePool.sol`, earning a 100 bps protocol fee on active loans and reimbursing lenders automatically in the event of default.
5. **Autonomous Escrow**: Fully decentralized fund custody, disbursal, repayment, and slashing via EVM smart contracts.

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER: Next.js 16                             │
│       Tailwind CSS v4 • WebGL Shaders (Aurora / GradientWaves)             │
│   Borrower Console  •  Lender Terminal  •  Insurer Underwriting Matrix     │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ REST API / Web3
                                      ▼
┌─────────────────────────────────────┴──────────────────────────────────────┐
│                    APPLICATION BACKEND & ORCHESTRATION                     │
│  ┌───────────────────────────────┐     ┌────────────────────────────────┐  │
│  │ Node.js / Express Gateway     │     │ Python FastAPI Microservice    │  │
│  │ User Auth & Sessions          │◄───►│ Web3.py Contract Adapter       │  │
│  │Supabase Persistence (Postgres)│     │ ML Scoring Interface           │  │
│  └───────────────────────────────┘     └──────────────┬─────────────────┘  │
└───────────────────────────────────────────────────────┼────────────────────┘
                                                        │
                                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    SMART CONTRACT LAYER (EVM / Hardhat)                    │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌───────────────────┐  │
│  │ LoanEscrow.sol        │ │ InsurancePool.sol    │ │ LenderPool.sol    │  │
│  │ Autonomous Disbursal  │ │ Underwriting Reserves│ │ Liquidity Pools   │  │
│  └───────────┬───────────┘ └───────────┬──────────┘ └─────────┬─────────┘  │
│              └─────────────────────────┼──────────────────────┘            │
│                                        ▼                                   │
│                        ┌───────────────────────────────┐                   │
│                        │ ReputationRegistry.sol        │                   │
│                        │ Immutable Defaulter Blacklist │                   │
│                        └───────────────────────────────┘                   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Smart Contract Suite

| Contract | Purpose | Core Functions |
|:---|:---|:---|
| [`LoanEscrow.sol`](file:///c:/Users/Rishit/Desktop/PROJECTS/Credloom/blockchain/contracts/LoanEscrow.sol) | Coordinates loan proposal, funding, disbursal, repayments, and default handling. | `createLoanProposal()`, `fundLoan()`, `disburseLoan()`, `repayLoan()`, `handleDefault()` |
| [`ReputationRegistry.sol`](file:///c:/Users/Rishit/Desktop/PROJECTS/Credloom/blockchain/contracts/ReputationRegistry.sol) | Immutable on-chain record of wallet credit standing. Flags defaulters permanently. | `flagBorrower()`, `unflagBorrower()`, `isFlagged()` |
| [`InsurancePool.sol`](file:///c:/Users/Rishit/Desktop/PROJECTS/Credloom/blockchain/contracts/InsurancePool.sol) | Underwriting capital pool. Collects premiums and reimburses lenders on liquidation. | `depositInsurance()`, `withdrawInsurance()`, `payoutDefault()` |
| [`LenderLiquidityPool.sol`](file:///c:/Users/Rishit/Desktop/PROJECTS/Credloom/blockchain/contracts/LenderLiquidityPool.sol) | Pre-funded lender capital vaults with minimum credit score rules and automatic locking. | `depositLiquidity()`, `withdrawLiquidity()`, `lockFundsForLoan()` |

### Smart Contract Lifecycle Pipeline
```
1. PROPOSAL ───────► 2. ESCROW ───────► 3. DISBURSED ───────► 4. SETTLED
(Borrower / Lender)   (Funds Locked)     (Disbursed to Wallet) (Repaid in Full)
                                                  │
                                                  ▼ (If Deadline Exceeded)
                                            5. DEFAULT & SLASHING
                                            (Permanent On-Chain Flag)
```

---

## Machine Learning Credit Scoring Engine

Credloom utilizes a **Gradient Boosting Regressor (GBR)** trained on wallet behavioral vectors:

* **Input Features**:
  1. `total_transactions`: Total lifetime on-chain transactions.
  2. `num_previous_loans`: Completed loans within Credloom protocol.
  3. `total_previous_loans_eth`: Aggregate historical loan volume.
  4. `holding_days`: Wallet age and average holding tenure.
  5. `Tier`: Verification level (1 = Basic, 2 = ENS, 3 = Gitcoin Passport).
* **Target Output**: $P(\text{Default}) \in [0.0, 1.0]$ (Default Probability).
* **Calibrated Credit Score**:
  $$\text{Credit Score} = \text{round}\big((1 - P(\text{Default})) \times 1000\big)$$

### Tier Verification Hierarchy

| Tier | Verification Method | Max Borrow Cap | APR Range | Collateral Required |
|:---:|:---|:---:|:---:|:---:|
| **Tier 1** | Basic Wallet Signature | **1.00 ETH** | 12.0% – 18.0% | 0% |
| **Tier 2** | Reverse-Resolved ENS Domain | **2.50 ETH** | 8.0% – 12.0% | 0% |
| **Tier 3** | Gitcoin Passport Cryptographic Proof | **5.00 ETH** | 5.0% – 8.0% | 0% |

---

## Repository Structure

```
Credloom/
├── blockchain/                  # Hardhat EVM development suite
│   ├── contracts/               # Solidity smart contracts
│   ├── scripts/deploy.js        # Autonomous multi-contract deployment script
│   └── test/                    # Hardhat test suites
├── blockchain-service/          # Python FastAPI microservice
│   ├── app/                     # Web3.py contract adapter & API routes
│   └── requirements.txt         # FastAPI, Web3.py, uvicorn
├── backend/                     # Node.js / Express API gateway
│   ├── index.js                 # Authentication & loan management routes
│   └── package.json
├── frontend/                    # Next.js 16 App Router application
│   ├── src/app/                 # All role terminals (/borrower, /lender, /insurer, /dashboard)
│   ├── src/components/ui/       # Precision UI components & WebGL shaders (Aurora, GradientWaves)
│   └── package.json
├── mlModel/                     # Trained ML artifacts & inference script
│   ├── best_gbr_risk_model_2.pkl# Serialized Gradient Boosting Regressor
│   └── model.py                 # FastAPI prediction endpoint
└── context.md                   # Full technical specification & architecture deep dive
```

---

## Local Development & Quickstart

### Prerequisites
* **Node.js** v18+ and **npm**
* **Python** 3.10+
* **Git**

---

### 1. Smart Contracts & Local Blockchain

```bash
cd blockchain
npm install
npx hardhat node
```

In a separate terminal, deploy the contract suite to the local node:
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```
*Take note of the deployed contract addresses printed to console.*

---

### 2. Machine Learning Risk Model & Blockchain Microservice

```bash
cd blockchain-service
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Fill contract addresses from step 1 into .env

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

### 3. Backend API Gateway

```bash
cd backend
npm install
cp .env.example .env
# Configure your Supabase URL & Service Role key in .env

npm run dev
# Starts backend server on http://localhost:5000
```

---

### 4. Frontend Web Terminal

```bash
cd frontend
npm install
cp .env.example .env.local

npm run dev
# Starts terminal frontend on http://localhost:3000
```

---

## Design System & Interface

The frontend follows a **precision financial-instrument aesthetic**:
* **Palette**: Deep Ink (`#0E1013`), Elevated Surface (`#14171C`), Hairline Borders (`#2A2D33`), Signal Green (`#1B7A5A`), Brick Red (`#B23B3B`), Brass Gold (`#C9A24B`).
* **Atmospheric Shaders**:
  * **`<GradientWaves />`**: WebGL2 raymarched sine-plasma wave horizon in the landing hero.
  * **`<Aurora />`**: Ambient multi-stop WebGL simplex-noise aurora animating across all application terminals.
* **Typography**: Clean hierarchy with Inter (`font-sans`) and calibrated tabular numerals with JetBrains Mono (`font-mono`).

---

## Security & Protocol Safeguards

* **Zero Plaintext Secrets**: Local `.env` files are strictly ignored and isolated via root `.gitignore`.
* **Automated Capital Reimbursement**: When default conditions are met, `InsurancePool.sol` automatically transfers principal compensation to the lender, avoiding manual claims arbitration.
* **Irreversible Blacklisting**: Once flagged in `ReputationRegistry.sol`, smart contract guards disallow any future loan creation from the flagged wallet address across all lending pools.

---

## Author

* **Rishit** ([@rizzit17](https://github.com/rizzit17))

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
