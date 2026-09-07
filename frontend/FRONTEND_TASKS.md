# Credloom — Frontend Task Breakdown

> **Decentralized Micro-Lending Marketplace**
> Privacy-Preserving • Reputation-Based • Insured Lending

This document is the complete frontend engineering guide for Credloom. It covers every screen, component, integration, and deliverable required to ship a production-ready frontend. Each section includes acceptance criteria so progress can be tracked objectively.

---

## Table of Contents

1. [Tech Stack & Setup](#1-tech-stack--setup)
2. [Project Structure](#2-project-structure)
3. [Shared / Global Tasks](#3-shared--global-tasks)
4. [Wallet Integration](#4-wallet-integration)
5. [Landing Page](#5-landing-page)
6. [Borrower UI](#6-borrower-ui)
7. [Lender UI](#7-lender-ui)
8. [Insurer UI](#8-insurer-ui)
9. [Smart Contract Integration](#9-smart-contract-integration)
10. [Data Visualization & Risk Indicators](#10-data-visualization--risk-indicators)
11. [Event Listeners & Real-Time Updates](#11-event-listeners--real-time-updates)
12. [Error Handling & Edge Cases](#12-error-handling--edge-cases)
13. [Responsive Design & Accessibility](#13-responsive-design--accessibility)
14. [Testing](#14-testing)
15. [Performance & Optimization](#15-performance--optimization)
16. [Deployment Checklist](#16-deployment-checklist)

---

## 1. Tech Stack & Setup

### Current Stack
| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React, React Icons |
| Animation | Framer Motion |

### To Be Added
| Layer | Tool | Purpose |
|---|---|---|
| Wallet | `wagmi` + `viem` | Wallet connection, contract reads/writes |
| Wallet UI | `@rainbow-me/rainbowkit` or `ConnectKit` | Pre-built connect button & modal |
| State | `zustand` or React Context | Global app state (user role, wallet, scores) |
| Data Fetching | `@tanstack/react-query` | Server state, caching, background refetch |
| Charts | `recharts` or `@tremor/react` | Credit score graphs, loan analytics |
| Forms | `react-hook-form` + `zod` | Form validation (loan amounts, config) |
| Notifications | `sonner` or `react-hot-toast` | Transaction feedback, alerts |
| Date Handling | `date-fns` | Repayment deadlines, countdown timers |
| Markdown/Docs | `@mdx-js/react` (optional) | Docs / help pages |

### Setup Tasks

- [ ] **T-1.1** Install and configure `wagmi`, `viem`, and a wallet UI kit
- [ ] **T-1.2** Install `zustand` (or set up Context providers) for global state
- [ ] **T-1.3** Install `@tanstack/react-query` and wrap app in `QueryClientProvider`
- [ ] **T-1.4** Install `react-hook-form` + `zod` for form handling
- [ ] **T-1.5** Install a charting library (`recharts` or `@tremor/react`)
- [ ] **T-1.6** Install `sonner` for toast notifications
- [ ] **T-1.7** Install `date-fns` for date utilities
- [ ] **T-1.8** Set up environment variables (`.env.local`) for:
  - RPC URL
  - Contract addresses
  - Verification provider API base URL
  - Chain ID
- [ ] **T-1.9** Configure wagmi chains and transports in a `config/wagmi.ts` file

---

## 2. Project Structure

Target folder layout inside `src/`:

```
src/
├── app/
│   ├── layout.js                    # Root layout (providers, navbar)
│   ├── page.js                      # Landing / home page
│   ├── borrower/
│   │   ├── page.js                  # Borrower dashboard
│   │   ├── onboarding/
│   │   │   └── page.js              # Onboarding + verification flow
│   │   ├── marketplace/
│   │   │   └── page.js              # Loan marketplace
│   │   ├── loan/
│   │   │   └── [loanId]/
│   │   │       └── page.js          # Individual loan detail / repayment
│   │   └── stake/
│   │       └── page.js              # Stake locking UI
│   ├── lender/
│   │   ├── page.js                  # Lender dashboard
│   │   ├── configure/
│   │   │   └── page.js              # Risk configuration
│   │   ├── escrow/
│   │   │   └── page.js              # Escrow funding
│   │   └── loan/
│   │       └── [loanId]/
│   │           └── page.js          # Individual loan tracking
│   ├── insurer/
│   │   ├── page.js                  # Insurer dashboard
│   │   ├── configure/
│   │   │   └── page.js              # Insurance configuration
│   │   └── premiums/
│   │       └── page.js              # Premium tracking
│   └── not-found.js                 # 404 page
├── components/
│   ├── ui/                          # Reusable primitives (Button, Card, Badge, Modal, etc.)
│   ├── layout/                      # Navbar, Sidebar, Footer, DashboardShell
│   ├── wallet/                      # ConnectButton, WalletInfo, NetworkBadge
│   ├── borrower/                    # Borrower-specific components
│   ├── lender/                      # Lender-specific components
│   ├── insurer/                     # Insurer-specific components
│   └── shared/                      # CreditScoreGauge, LoanCard, StatusBadge, etc.
├── hooks/                           # Custom hooks (useContract, useCreditScore, useLoan, etc.)
├── lib/                             # Utility functions, constants, ABIs
│   ├── contracts/                   # ABI files + contract address constants
│   ├── utils.js                     # Formatters, helpers
│   └── constants.js                 # Tiers, statuses, config defaults
├── store/                           # Zustand stores (or Context files)
├── config/
│   └── wagmi.js                     # Wagmi config + chains
└── styles/
    └── globals.css                  # Tailwind base + custom tokens
```

### Structure Tasks

- [ ] **T-2.1** Create the folder structure above (all directories)
- [ ] **T-2.2** Create placeholder `page.js` files with route-appropriate titles
- [ ] **T-2.3** Set up `lib/constants.js` with tier definitions, loan statuses, and default configs
- [ ] **T-2.4** Create `lib/utils.js` with common helpers:
  - `formatAddress(address)` — truncate wallet address (0x1234...abcd)
  - `formatCurrency(amount)` — display token amounts
  - `formatDate(timestamp)` — human-readable dates
  - `calculateInterestRate(creditScore)` — derive rate from score
  - `getTierLabel(tier)` — map tier number to label
  - `getStatusColor(status)` — map loan status to color

---

## 3. Shared / Global Tasks

These are cross-cutting concerns used across all three user roles.

### 3.1 Layout & Navigation

- [ ] **T-3.1** Build `DashboardShell` component — sidebar + top bar + content area
- [ ] **T-3.2** Build role-based sidebar navigation:
  - Borrower: Dashboard, Marketplace, My Loans, Stake, Profile
  - Lender: Dashboard, Configure, Escrow, Active Loans
  - Insurer: Dashboard, Configure, Premiums, Covered Loans
- [ ] **T-3.3** Build top bar with:
  - Wallet connect button
  - Connected address display
  - Network indicator badge (correct chain / wrong chain warning)
  - Role indicator (Borrower / Lender / Insurer)
- [ ] **T-3.4** Implement mobile-responsive sidebar (hamburger menu, slide-in drawer)
- [ ] **T-3.5** Build `Footer` component for dashboard pages

### 3.2 Reusable UI Components

Build a consistent design system. Each component should support dark theme.

- [ ] **T-3.6** `Button` — variants: primary (gradient), secondary, outline, ghost, danger, loading state
- [ ] **T-3.7** `Card` — with header, body, footer slots; border glow variant
- [ ] **T-3.8** `Badge` — status badges (Active, Repaid, Defaulted, Flagged, Cooldown, Pending)
- [ ] **T-3.9** `Modal` — overlay dialog with close, confirm/cancel actions, loading state
- [ ] **T-3.10** `Input` — text, number, with label, error message, prefix/suffix (e.g., token symbol)
- [ ] **T-3.11** `Select` — dropdown with options
- [ ] **T-3.12** `Slider` — range input for amounts, durations
- [ ] **T-3.13** `Tooltip` — hover info for scores, rates, terms
- [ ] **T-3.14** `Skeleton` — loading placeholder for all card types
- [ ] **T-3.15** `EmptyState` — illustrated empty state for no loans, no data
- [ ] **T-3.16** `ConfirmationDialog` — "Are you sure?" for stake lock, loan accept, etc.
- [ ] **T-3.17** `TransactionStatus` — pending → confirming → confirmed → failed states
- [ ] **T-3.18** `ProgressBar` — for loan repayment progress (amount repaid / total)
- [ ] **T-3.19** `Countdown` — time remaining until repayment deadline
- [ ] **T-3.20** `StatCard` — number + label + trend indicator (used across all dashboards)

### 3.3 Toast / Notification System

- [ ] **T-3.21** Set up `sonner` (or equivalent) toast provider in root layout
- [ ] **T-3.22** Create notification helper functions:
  - `notifySuccess(message)`
  - `notifyError(message)`
  - `notifyTxPending(hash)`
  - `notifyTxConfirmed(hash)`
  - `notifyTxFailed(hash, reason)`

### 3.4 Role Selection

- [ ] **T-3.23** Build role selection screen (shown after wallet connect if user has no role):
  - Three cards: Borrower, Lender, Insurer
  - Clear descriptions of each role
  - "Continue as [Role]" button
- [ ] **T-3.24** Persist selected role in zustand store + localStorage
- [ ] **T-3.25** Implement route guards — redirect users to their role's dashboard

---

## 4. Wallet Integration

### 4.1 Core Wallet Setup

- [ ] **T-4.1** Configure wagmi with supported chains (e.g., Polygon, Sepolia testnet)
- [ ] **T-4.2** Set up `WagmiProvider` + `QueryClientProvider` in root layout
- [ ] **T-4.3** Build `ConnectWalletButton` component using RainbowKit or ConnectKit
- [ ] **T-4.4** Display connected wallet state:
  - Truncated address
  - Balance (native token)
  - Network name + icon
  - Disconnect option

### 4.2 Wallet Guards & State

- [ ] **T-4.5** Build `WalletGuard` wrapper — shows "Connect Wallet" prompt if disconnected
- [ ] **T-4.6** Build `NetworkGuard` wrapper — shows "Switch Network" prompt if wrong chain
- [ ] **T-4.7** Create `useWallet` hook that exposes:
  - `address`
  - `isConnected`
  - `balance`
  - `chainId`
  - `isCorrectChain`
- [ ] **T-4.8** Handle wallet disconnection gracefully (clear state, redirect to landing)
- [ ] **T-4.9** Handle account/chain switching mid-session

### 4.3 Transaction UX

- [ ] **T-4.10** Build `useTransaction` hook wrapping wagmi's `useWriteContract`:
  - Pending state
  - Confirmation waiting
  - Success callback
  - Error handling with user-friendly messages
- [ ] **T-4.11** Show transaction status toast on every contract write
- [ ] **T-4.12** Link to block explorer for transaction hashes
- [ ] **T-4.13** Handle common wallet errors:
  - User rejected transaction
  - Insufficient funds
  - Gas estimation failed
  - Network timeout

---

## 5. Landing Page

> **Status: V1 Complete** — current `page.js` has hero, features, how-it-works, user roles, tech stack, CTA, and footer.

### Refinement Tasks

- [ ] **T-5.1** Add animated gradient background or particle effect to hero (Framer Motion)
- [ ] **T-5.2** Add scroll-triggered animations to feature cards (fade-in, slide-up)
- [ ] **T-5.3** Add an animated stats counter (count-up effect for key metrics)
- [ ] **T-5.4** Add smooth scrolling for anchor links (#features, #how-it-works, etc.)
- [ ] **T-5.5** Connect "Get Started" / "Launch App" buttons to wallet connect flow
- [ ] **T-5.6** Add a "How the Escrow Works" visual diagram section
- [ ] **T-5.7** Add a FAQ accordion section
- [ ] **T-5.8** Make landing page fully responsive (test at 320px, 768px, 1024px, 1440px)
- [ ] **T-5.9** Add SEO metadata (title, description, OG image) in layout or page metadata export

---

## 6. Borrower UI

### 6.1 Onboarding & Verification Flow

**Route:** `/borrower/onboarding`

This is a multi-step wizard. Each step must be completable before proceeding.

#### Step 1: Wallet Connection
- [ ] **T-6.1** Show wallet connect prompt if not already connected
- [ ] **T-6.2** Display connected wallet address and balance
- [ ] **T-6.3** "Next" button becomes active only after connection

#### Step 2: Identity Verification
- [ ] **T-6.4** Explain the verification process (what data is used, what is NOT stored)
- [ ] **T-6.5** Display privacy assurance messaging prominently
- [ ] **T-6.6** "Verify with DigiLocker" button → redirect to third-party verification
- [ ] **T-6.7** Handle verification callback:
  - On success: show green checkmark, store `verified = true` + verification hash in backend
  - On failure: show error message with retry option
- [ ] **T-6.8** Handle edge case: user already verified (skip this step)
- [ ] **T-6.9** Handle edge case: verification hash matches a flagged/defaulted account → show block message

#### Step 3: Data Consent
- [ ] **T-6.10** Display list of on-chain data points that can be used for scoring:
  - Total transactions
  - Transaction volume
  - Account age
  - Previous loan history (if any)
- [ ] **T-6.11** Checkboxes to opt-in/out of each data point
- [ ] **T-6.12** Minimum required data points must be selected (show validation)
- [ ] **T-6.13** Explain how each data point affects credit score

#### Step 4: Stake Locking
- [ ] **T-6.14** Show minimum stake requirement based on assigned tier
- [ ] **T-6.15** Input field for stake amount (with min/max validation)
- [ ] **T-6.16** Show wallet balance and remaining balance after stake
- [ ] **T-6.17** "Lock Stake" button → calls smart contract `lockStake(amount)`
- [ ] **T-6.18** Show transaction status (pending → confirmed)
- [ ] **T-6.19** On success: display confirmation + generated credit score + tier assignment

#### Step 5: Onboarding Complete
- [ ] **T-6.20** Summary card showing:
  - Wallet address
  - Verification status ✓
  - Credit score
  - Tier
  - Staked amount
  - Borrowing limit
- [ ] **T-6.21** "Go to Dashboard" button

#### Onboarding UX
- [ ] **T-6.22** Progress stepper component at the top (Step 1 of 5, Step 2 of 5, etc.)
- [ ] **T-6.23** Persist onboarding progress (if user leaves and returns, resume at last step)
- [ ] **T-6.24** Back button on each step (except step 1)

---

### 6.2 Borrower Dashboard

**Route:** `/borrower`

- [ ] **T-6.25** **Wallet Info Card**
  - Connected address
  - Native token balance
  - Staked amount
  - Available balance (balance − locked amounts)

- [ ] **T-6.26** **Credit Score Card**
  - Large score display (circular gauge / radial progress)
  - Score label (Poor / Fair / Good / Excellent)
  - Score trend indicator (↑ improving, ↓ declining, → stable)
  - "How is this calculated?" tooltip or expandable section

- [ ] **T-6.27** **Tier Badge**
  - Current tier with visual badge
  - Tier benefits summary (max loan, max duration, rate range)
  - Progress to next tier (if applicable)

- [ ] **T-6.28** **Active Loans Summary**
  - Count of active loans
  - Total outstanding amount
  - Nearest upcoming deadline (with countdown)
  - "View All" link to full loan list

- [ ] **T-6.29** **Active Loans Table / List**
  - Columns: Loan ID, Amount, Interest Rate, Duration, Status, Deadline, Progress
  - Status badges: Active, Repaying, Overdue, Repaid, Defaulted
  - Click row → navigate to `/borrower/loan/[loanId]`
  - Pagination or infinite scroll for many loans

- [ ] **T-6.30** **Borrowing Eligibility Banner**
  - If eligible: show max borrowable amount + "Apply for Loan" CTA
  - If flagged: show red warning banner — "Your account is flagged due to default. Borrowing is suspended."
  - If in cooldown: show cooldown timer — "You can apply again in X days"
  - If insufficient stake: show "Top up your stake to unlock borrowing"

- [ ] **T-6.31** **Repayment Schedule Widget**
  - Calendar or timeline view of upcoming repayments
  - Highlight overdue payments in red
  - Quick-pay button for nearest deadline

- [ ] **T-6.32** **Notification Feed** (optional)
  - Recent events: loan approved, repayment due soon, score changed, etc.

---

### 6.3 Loan Marketplace

**Route:** `/borrower/marketplace`

- [ ] **T-6.33** **Loan Amount Input**
  - Input field for desired loan amount
  - Show max borrowable amount based on credit score
  - Real-time validation: amount ≤ max allowed
  - Token selector (if multiple tokens supported)

- [ ] **T-6.34** **Eligibility Check**
  - On submit, call backend API to check eligibility
  - If not eligible: show reason (low score, flagged, insufficient stake, etc.)
  - If eligible: fetch matching lenders

- [ ] **T-6.35** **Lender Listing**
  - Display matched lenders as cards (lender identity is NOT shown)
  - Each card shows:
    - Available amount range
    - Loan durations offered (e.g., 30 days, 60 days, 90 days)
    - Insurance status (insured / uninsured badge)
  - **NOT shown:** lender wallet address, lender name, per-lender variable interest

- [ ] **T-6.36** **Interest Rate Display**
  - Interest rate is determined by the borrower's credit score
  - Show the rate prominently: "Your rate: X% based on your credit score"
  - If score qualifies for a range, show allowed options (e.g., dropdown of 8%, 10%, 12%)
  - Borrower selects preferred rate + duration combination

- [ ] **T-6.37** **Loan Summary & Confirmation**
  - Before confirming, show summary:
    - Loan amount
    - Interest rate
    - Duration
    - Total repayment amount
    - Repayment schedule (lump sum or installments)
    - Insurance coverage status
  - "Confirm & Accept Loan" button

- [ ] **T-6.38** **Loan Acceptance Transaction**
  - Call smart contract to initiate loan
  - Show transaction status (pending → confirmed)
  - On success: show "Loan Disbursed!" confirmation
  - Redirect to loan detail page

- [ ] **T-6.39** **Empty State**
  - No matching lenders found → "No lenders match your request. Try a different amount or check back later."

- [ ] **T-6.40** **Filters / Sort** (if multiple results)
  - Sort by: duration, insurance status
  - Filter by: insured only, max duration

---

### 6.4 Individual Loan Detail / Repayment

**Route:** `/borrower/loan/[loanId]`

- [ ] **T-6.41** **Loan Overview Card**
  - Loan ID
  - Amount borrowed
  - Interest rate
  - Start date
  - Deadline
  - Total amount due
  - Amount repaid so far
  - Remaining balance
  - Status badge

- [ ] **T-6.42** **Repayment Progress Bar**
  - Visual progress: amount repaid / total due
  - Percentage label

- [ ] **T-6.43** **Countdown Timer**
  - Days:Hours:Minutes until deadline
  - Color changes: green (>7 days), yellow (3–7 days), red (<3 days)

- [ ] **T-6.44** **Repay Button**
  - "Repay Full Amount" button
  - "Repay Partial Amount" with input field (if installments supported)
  - Show wallet balance and whether it covers repayment
  - Transaction flow: pending → confirmed → success

- [ ] **T-6.45** **Repayment History**
  - Table of all repayment transactions
  - Columns: Date, Amount, TX Hash (linked to explorer), Status

- [ ] **T-6.46** **Post-Repayment State**
  - On full repayment: show "Loan Repaid ✓", updated credit score, stake release status

- [ ] **T-6.47** **Default Warning**
  - If deadline passes without repayment:
    - Red banner: "This loan is in default"
    - Show consequences: stake slashing, credit score impact, flag status
    - Account-level warning about cooldown period

---

### 6.5 Stake Management

**Route:** `/borrower/stake`

- [ ] **T-6.48** **Current Stake Display**
  - Total staked amount
  - Locked amount (tied to active loans)
  - Unlockable amount (not tied to any active loan)

- [ ] **T-6.49** **Add Stake**
  - Input field for additional stake amount
  - "Lock Additional Stake" button → smart contract call
  - Transaction status feedback

- [ ] **T-6.50** **Withdraw Stake**
  - Only available if no active loans and not flagged
  - Input field for withdrawal amount (up to unlockable amount)
  - "Withdraw Stake" button → smart contract call
  - Transaction status feedback

- [ ] **T-6.51** **Stake History**
  - Table: Date, Action (Locked / Withdrawn / Slashed), Amount, TX Hash

---

## 7. Lender UI

### 7.1 Lender Dashboard

**Route:** `/lender`

- [ ] **T-7.1** **Wallet Info Card**
  - Connected address
  - Wallet balance
  - Escrowed amount
  - Available (non-escrowed) balance

- [ ] **T-7.2** **Portfolio Summary Cards**
  - Total amount lent
  - Total amount returned (principal + interest)
  - Number of active loans
  - Number of defaults
  - Overall return rate (%)
  - Insurance coverage rate (% of loans insured)

- [ ] **T-7.3** **Active Loans Table**
  - Columns: Loan ID, Amount, Borrower Score, Interest Rate, Duration, Status, Deadline, Insurance
  - Status badges: Pending, Active, Repaid, Defaulted
  - Borrower identity NOT shown (only credit score + tier)
  - Click row → navigate to `/lender/loan/[loanId]`
  - Sort by: amount, deadline, status, interest rate

- [ ] **T-7.4** **Earnings Chart**
  - Line or bar chart showing earnings over time
  - Toggle: weekly / monthly / all-time
  - Show interest earned vs defaults lost

- [ ] **T-7.5** **Lending Status Indicator**
  - Active (accepting borrowers) / Inactive (paused)
  - Remaining escrowed capacity
  - Quick link to "Configure" and "Add Funds"

---

### 7.2 Lending Configuration

**Route:** `/lender/configure`

- [ ] **T-7.6** **Risk Configuration Form**
  - **Minimum Borrower Credit Score** — slider (0–1000) with labeled zones (Poor/Fair/Good/Excellent)
  - **Maximum Loan Amount** — number input with token symbol
  - **Maximum Loan Duration** — dropdown or slider (30/60/90/120/180 days)
  - **Insurance Preference** — toggle: Required / Preferred / Not Required
  - **Maximum Insurable Amount** — number input (only if insurance is Required or Preferred)

- [ ] **T-7.7** **Configuration Preview**
  - "With these settings, you will match approximately X% of borrowers"
  - Visual indicator of risk level (conservative → moderate → aggressive)

- [ ] **T-7.8** **Save Configuration**
  - "Save Settings" button
  - Validate all fields before saving
  - Store config on backend (or on-chain if applicable)
  - Toast confirmation

- [ ] **T-7.9** **Configuration History** (optional)
  - Log of past config changes with timestamps

---

### 7.3 Escrow Funding

**Route:** `/lender/escrow`

- [ ] **T-7.10** **Escrow Balance Display**
  - Total escrowed
  - Amount allocated to active loans
  - Available for new loans
  - Visual breakdown (pie chart or bar)

- [ ] **T-7.11** **Deposit to Escrow**
  - Input field for deposit amount
  - Show wallet balance
  - "Deposit" button → smart contract call `depositToEscrow(amount)`
  - Transaction status feedback

- [ ] **T-7.12** **Withdraw from Escrow**
  - Only unallocated funds can be withdrawn
  - Input field for withdrawal amount (max = available)
  - "Withdraw" button → smart contract call `withdrawFromEscrow(amount)`
  - Transaction status feedback

- [ ] **T-7.13** **Escrow Transaction History**
  - Table: Date, Type (Deposit / Withdrawal / Allocation / Return), Amount, TX Hash

- [ ] **T-7.14** **Minimum Escrow Warning**
  - If escrowed amount drops below minimum required to stay active:
    - Warning banner: "Your lending listing is inactive. Deposit more funds to activate."

---

### 7.4 Individual Loan Tracking (Lender View)

**Route:** `/lender/loan/[loanId]`

- [ ] **T-7.15** **Loan Overview**
  - Loan amount, interest rate, duration, deadline
  - Borrower credit score + tier (NO identity)
  - Insurance status (insured by whom — anonymous, just coverage %)
  - Repayment progress bar

- [ ] **T-7.16** **Expected Return**
  - Principal + interest calculation
  - If insured: show insured vs uninsured payout scenarios

- [ ] **T-7.17** **Loan Status Updates**
  - Timeline view: Created → Funded → Active → Repaid/Defaulted
  - Highlight current status

- [ ] **T-7.18** **Default Outcome Display**
  - If loan defaults:
    - If insured: "Insurance payout of X received" with TX link
    - If uninsured: "Loss of X recorded" with red indicator

---

## 8. Insurer UI

### 8.1 Insurer Dashboard

**Route:** `/insurer`

- [ ] **T-8.1** **Wallet Info Card**
  - Connected address, balance, reserved amount

- [ ] **T-8.2** **Insurance Portfolio Summary**
  - Total coverage provided
  - Total premiums earned
  - Total claims paid
  - Active policies count
  - Net profit/loss

- [ ] **T-8.3** **Active Policies Table**
  - Columns: Policy ID, Loan ID, Coverage Amount, Coverage %, Borrower Score, Loan Status, Premium
  - Status badges: Active, Claimed, Expired, Paid Out
  - Click row → policy detail

- [ ] **T-8.4** **Earnings vs Claims Chart**
  - Premiums earned over time vs claims paid
  - Net position indicator

---

### 8.2 Insurance Configuration

**Route:** `/insurer/configure`

- [ ] **T-8.5** **Insurance Configuration Form**
  - **Minimum Borrower Credit Score** — slider with labeled zones
  - **Coverage Percentage** — slider (10%–100%) — what % of loan the insurer will cover on default
  - **Maximum Insurance Amount** — number input with token symbol
  - **Premium Rate** — expected premium percentage on successful repayment

- [ ] **T-8.6** **Risk Preview**
  - "You will be eligible to insure approximately X% of marketplace loans"
  - Risk exposure summary

- [ ] **T-8.7** **Reserve Locking**
  - Insurer must lock reserves to back their coverage commitments
  - Input for reserve amount
  - "Lock Reserves" → smart contract call
  - Display locked vs available reserves

- [ ] **T-8.8** **Save Configuration**
  - Validate + save settings
  - Toast confirmation

---

### 8.3 Premium Tracking

**Route:** `/insurer/premiums`

- [ ] **T-8.9** **Premium History Table**
  - Columns: Date, Loan ID, Premium Amount, Status (Earned / Pending)
  - Sortable by date, amount

- [ ] **T-8.10** **Claim History Table**
  - Columns: Date, Loan ID, Claim Amount, Borrower Score at Default, TX Hash
  - Highlight high-loss claims

- [ ] **T-8.11** **Withdraw Premiums**
  - "Withdraw Earned Premiums" button
  - Amount available for withdrawal
  - Smart contract call + transaction status

---

## 9. Smart Contract Integration

### 9.1 Contract ABIs & Addresses

- [ ] **T-9.1** Create `lib/contracts/` directory with:
  - `EscrowContract.json` — ABI
  - `LoanContract.json` — ABI
  - `StakeContract.json` — ABI
  - `addresses.js` — deployed contract addresses per chain

### 9.2 Custom Hooks for Contract Interaction

Each hook wraps wagmi's `useReadContract` / `useWriteContract` for a specific contract function.

#### Escrow Hooks
- [ ] **T-9.2** `useEscrowBalance(address)` — read escrowed balance for a lender
- [ ] **T-9.3** `useDepositToEscrow()` — write: deposit funds into escrow
- [ ] **T-9.4** `useWithdrawFromEscrow()` — write: withdraw unallocated funds

#### Stake Hooks
- [ ] **T-9.5** `useStakeBalance(address)` — read staked amount for borrower
- [ ] **T-9.6** `useLockStake()` — write: lock stake
- [ ] **T-9.7** `useWithdrawStake()` — write: withdraw unlocked stake

#### Loan Hooks
- [ ] **T-9.8** `useCreateLoan()` — write: instantiate a loan contract
- [ ] **T-9.9** `useRepayLoan(loanId)` — write: repay loan
- [ ] **T-9.10** `useLoanDetails(loanId)` — read: loan metadata (amount, rate, deadline, status)
- [ ] **T-9.11** `useBorrowerLoans(address)` — read: all loans for a borrower
- [ ] **T-9.12** `useLenderLoans(address)` — read: all loans funded by a lender

#### Flag / Reputation Hooks
- [ ] **T-9.13** `useIsFlagged(address)` — read: check if borrower is flagged
- [ ] **T-9.14** `useCooldownStatus(address)` — read: cooldown remaining time

---

## 10. Data Visualization & Risk Indicators

- [ ] **T-10.1** **Credit Score Gauge**
  - Circular/radial gauge component
  - Color-coded: red (0–300), orange (300–500), yellow (500–700), green (700–900), emerald (900–1000)
  - Animated on load and score change

- [ ] **T-10.2** **Tier Badge Component**
  - Visual badge for each tier (Bronze, Silver, Gold, Platinum)
  - Shows tier benefits on hover/click

- [ ] **T-10.3** **Loan Health Indicator**
  - Green: on track, plenty of time
  - Yellow: approaching deadline
  - Red: overdue or very close to deadline
  - Used in loan cards and tables

- [ ] **T-10.4** **Risk Level Visualization (Lender Config)**
  - Traffic light or meter showing conservative → aggressive based on config settings

- [ ] **T-10.5** **Portfolio Performance Chart (Lender)**
  - Line chart: cumulative earnings over time
  - Area chart: capital deployed vs returned

- [ ] **T-10.6** **Insurance Exposure Chart (Insurer)**
  - Pie chart: covered vs available capacity
  - Bar chart: premiums vs claims

- [ ] **T-10.7** **Repayment Timeline (Borrower)**
  - Horizontal timeline showing all upcoming repayments
  - Past payments in green, upcoming in blue, overdue in red

---

## 11. Event Listeners & Real-Time Updates

### On-chain Event Listeners

- [ ] **T-11.1** Listen for `LoanCreated` events — update lender dashboard when a new loan is matched
- [ ] **T-11.2** Listen for `LoanRepaid` events — update loan status, credit score, release stake
- [ ] **T-11.3** Listen for `LoanDefaulted` events — update loan status, show default banner
- [ ] **T-11.4** Listen for `StakeLocked` events — update borrower dashboard
- [ ] **T-11.5** Listen for `StakeSlashed` events — update borrower dashboard, show alert
- [ ] **T-11.6** Listen for `EscrowDeposited` / `EscrowWithdrawn` events — update lender escrow
- [ ] **T-11.7** Listen for `InsuranceClaimed` events — update insurer dashboard

### Implementation

- [ ] **T-11.8** Create `useContractEvents` hook using wagmi's `useWatchContractEvent`
- [ ] **T-11.9** On event received:
  - Invalidate relevant react-query caches
  - Show toast notification
  - Update UI immediately (optimistic where safe)
- [ ] **T-11.10** Handle reconnection / missed events gracefully

---

## 12. Error Handling & Edge Cases

### Wallet Errors
- [ ] **T-12.1** No wallet installed → show "Install MetaMask" prompt with link
- [ ] **T-12.2** Wrong network → show network switch prompt with one-click switch
- [ ] **T-12.3** User rejected transaction → show friendly message, don't crash
- [ ] **T-12.4** Insufficient balance → show balance required vs available

### Application Errors
- [ ] **T-12.5** API/backend unreachable → show retry button + offline indicator
- [ ] **T-12.6** Smart contract revert → parse revert reason and display human-readable error
- [ ] **T-12.7** Stale data → show "last updated X minutes ago" + refresh button

### Business Logic Edge Cases
- [ ] **T-12.8** Flagged borrower tries to apply → block with clear explanation
- [ ] **T-12.9** Borrower in cooldown → show remaining time
- [ ] **T-12.10** Lender with zero escrow tries to activate → show deposit prompt
- [ ] **T-12.11** Loan amount exceeds borrower's max → show max with explanation
- [ ] **T-12.12** No matching lenders → show empty state with suggestions
- [ ] **T-12.13** Verification hash collision → show "account already exists" error

---

## 13. Responsive Design & Accessibility

### Responsive
- [ ] **T-13.1** All pages functional at 320px width (mobile)
- [ ] **T-13.2** Tablet breakpoint (768px) — sidebar collapses, cards stack
- [ ] **T-13.3** Desktop (1024px+) — full sidebar, multi-column layouts
- [ ] **T-13.4** Large screens (1440px+) — constrained max-width, centered content
- [ ] **T-13.5** Touch-friendly targets (min 44px tap targets) on mobile
- [ ] **T-13.6** Test all modals and dropdowns on mobile

### Accessibility
- [ ] **T-13.7** Semantic HTML throughout (headings, landmarks, lists, tables)
- [ ] **T-13.8** Keyboard navigation for all interactive elements
- [ ] **T-13.9** Focus visible indicators on all focusable elements
- [ ] **T-13.10** ARIA labels on icon-only buttons and non-text elements
- [ ] **T-13.11** Color contrast ratio ≥ 4.5:1 for all text (WCAG AA)
- [ ] **T-13.12** Screen reader testing for critical flows (onboarding, loan application)
- [ ] **T-13.13** `prefers-reduced-motion` — disable animations for users who prefer reduced motion

---

## 14. Testing

### Unit Tests
- [ ] **T-14.1** Set up testing framework (Vitest + React Testing Library)
- [ ] **T-14.2** Test utility functions (`formatAddress`, `formatCurrency`, `calculateInterestRate`, etc.)
- [ ] **T-14.3** Test custom hooks with mock wagmi providers
- [ ] **T-14.4** Test form validation logic (loan amount, stake amount, config fields)

### Component Tests
- [ ] **T-14.5** Test `CreditScoreGauge` renders correct color/label for different scores
- [ ] **T-14.6** Test `LoanCard` renders all statuses correctly
- [ ] **T-14.7** Test `StatusBadge` for all status types
- [ ] **T-14.8** Test `TransactionStatus` for all states
- [ ] **T-14.9** Test role selection flow

### Integration Tests
- [ ] **T-14.10** Test borrower onboarding flow end-to-end (mocked contract calls)
- [ ] **T-14.11** Test loan application → selection → confirmation flow
- [ ] **T-14.12** Test lender config → escrow deposit → matching flow
- [ ] **T-14.13** Test repayment flow

### E2E Tests (optional, lower priority)
- [ ] **T-14.14** Set up Playwright or Cypress
- [ ] **T-14.15** E2E test: full borrower journey (connect → verify → stake → borrow → repay)
- [ ] **T-14.16** E2E test: full lender journey (connect → config → fund → receive repayment)

---

## 15. Performance & Optimization

- [ ] **T-15.1** Use Next.js dynamic imports (`next/dynamic`) for heavy components (charts, modals)
- [ ] **T-15.2** Lazy load below-the-fold sections on landing page
- [ ] **T-15.3** Optimize images (if any) with `next/image`
- [ ] **T-15.4** Minimize contract read calls — batch reads, use multicall where possible
- [ ] **T-15.5** Cache contract reads with react-query (appropriate stale times)
- [ ] **T-15.6** Debounce user inputs that trigger API/contract calls (search, amount inputs)
- [ ] **T-15.7** Use React.memo / useMemo for expensive renders (large tables, charts)
- [ ] **T-15.8** Analyze bundle size — ensure no unnecessary dependencies
- [ ] **T-15.9** Add loading skeletons for all async-loaded sections
- [ ] **T-15.10** Lighthouse audit: target ≥ 90 on Performance, Accessibility, Best Practices

---

## 16. Deployment Checklist

- [ ] **T-16.1** Environment variables configured for production (RPC URLs, contract addresses, chain ID)
- [ ] **T-16.2** Remove all `console.log` statements
- [ ] **T-16.3** Error boundaries in place for all major sections
- [ ] **T-16.4** 404 page styled and functional
- [ ] **T-16.5** Build succeeds without warnings (`npm run build`)
- [ ] **T-16.6** Verify all contract addresses point to mainnet/production contracts
- [ ] **T-16.7** Test wallet connect on production domain (CORS, redirect URIs)
- [ ] **T-16.8** SEO: meta tags, OG image, favicon
- [ ] **T-16.9** Analytics setup (if applicable)
- [ ] **T-16.10** Deploy to Vercel (or preferred platform)
- [ ] **T-16.11** Post-deploy smoke test: connect wallet, navigate all routes, verify contract reads

---

## Task Summary

| Section | Tasks | IDs |
|---|---|---|
| Tech Stack & Setup | 9 | T-1.1 → T-1.9 |
| Project Structure | 4 | T-2.1 → T-2.4 |
| Shared / Global | 25 | T-3.1 → T-3.25 |
| Wallet Integration | 13 | T-4.1 → T-4.13 |
| Landing Page | 9 | T-5.1 → T-5.9 |
| Borrower UI | 51 | T-6.1 → T-6.51 |
| Lender UI | 18 | T-7.1 → T-7.18 |
| Insurer UI | 11 | T-8.1 → T-8.11 |
| Smart Contract Integration | 14 | T-9.1 → T-9.14 |
| Data Visualization | 7 | T-10.1 → T-10.7 |
| Event Listeners | 10 | T-11.1 → T-11.10 |
| Error Handling | 13 | T-12.1 → T-12.13 |
| Responsive & Accessibility | 13 | T-13.1 → T-13.13 |
| Testing | 16 | T-14.1 → T-14.16 |
| Performance | 10 | T-15.1 → T-15.10 |
| Deployment | 11 | T-16.1 → T-16.11 |
| **Total** | **234** | |

---

## Suggested Priority Order

1. **Phase 1 — Foundation** (T-1.x, T-2.x, T-3.x, T-4.x)
   Setup, folder structure, design system, wallet integration

2. **Phase 2 — Borrower Core** (T-6.1 → T-6.47)
   Onboarding, dashboard, marketplace, repayment

3. **Phase 3 — Lender Core** (T-7.1 → T-7.18)
   Dashboard, config, escrow, loan tracking

4. **Phase 4 — Insurer** (T-8.1 → T-8.11)
   Dashboard, config, premium tracking

5. **Phase 5 — Contracts & Events** (T-9.x, T-11.x)
   Hook up real contracts, event listeners

6. **Phase 6 — Visualization** (T-10.x)
   Charts, gauges, risk indicators

7. **Phase 7 — Polish** (T-5.x, T-12.x, T-13.x, T-15.x)
   Landing page refinement, error handling, responsive, perf

8. **Phase 8 — Testing & Deploy** (T-14.x, T-16.x)
   Tests, deployment, smoke testing
