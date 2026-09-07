# Credloom Database Documentation

This document provides a comprehensive overview of the Credloom database schema, including all tables, their purposes, columns, and relationships.

---

## Table of Contents

1. [User Management](#user-management)
   - [users](#users)
   - [profiles](#profiles)
   - [wallets](#wallets)
   - [verifications](#verifications)

2. [Borrower System](#borrower-system)
   - [borrower_features](#borrower_features)
   - [credit_profiles](#credit_profiles)
   - [defaults_registry](#defaults_registry)
   - [risk_actions](#risk_actions)

3. [Lender System](#lender-system)
   - [lender_profiles](#lender_profiles)
   - [lender_loan_options](#lender_loan_options)

4. [Insurer System](#insurer-system)
   - [insurer_profiles](#insurer_profiles)

5. [Loan Management](#loan-management)
   - [loan_intents](#loan_intents)
   - [loans](#loans)
   - [loan_events](#loan_events)

6. [Liquidity Management](#liquidity-management)
   - [liquidity_positions](#liquidity_positions)

7. [Relationships](#relationships)

---

## User Management

### users

**Purpose**: Core user authentication and account management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique user identifier |
| primary_wallet | varchar | NOT NULL, UNIQUE | User's primary blockchain wallet address |
| username | varchar | UNIQUE | User's chosen username for login |
| password_hash | varchar | - | Hashed password for authentication |
| email | varchar | - | User's email address |
| status | varchar | DEFAULT 'active' | Account status (active, suspended, etc.) |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Key Features**:
- Primary table for user authentication
- Links to wallet addresses for blockchain interaction
- Supports traditional username/password login

---

### profiles

**Purpose**: Extended user profile information including KYC and tier status.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique profile identifier |
| wallet | varchar | NOT NULL, UNIQUE | Associated wallet address |
| tier | integer | DEFAULT 1 | User's verification tier (1-3) |
| tier_selected_at | timestamp | - | When tier was selected/verified |
| display_handle | varchar | - | Public display name |
| country_code | varchar | - | ISO country code |
| first_name | varchar | - | User's first name (KYC) |
| last_name | varchar | - | User's last name (KYC) |
| dob | varchar | - | Date of birth (KYC) |
| country | varchar | - | User's country |
| tax_id | varchar | - | Tax identification number (KYC) |
| meta | jsonb | - | Additional metadata in JSON format |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Profile creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| user_id | integer | FOREIGN KEY (users.id) | Reference to users table |

**Key Features**:
- Stores KYC verification data
- Tracks user tier level (1 = basic, 2 = verified, 3 = premium)
- Flexible metadata storage for additional attributes

---

### wallets

**Purpose**: Tracks all wallet addresses associated with users across different chains.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique wallet record identifier |
| wallet | varchar | NOT NULL, UNIQUE | Blockchain wallet address |
| user_id | integer | FOREIGN KEY (users.id) | Reference to users table |
| chain_id | integer | DEFAULT 1 | Blockchain network ID (1 = Ethereum mainnet) |
| first_seen_ts | timestamp | - | First interaction timestamp |
| last_seen_ts | timestamp | - | Most recent interaction timestamp |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Key Features**:
- Multi-wallet support per user
- Multi-chain support
- Activity tracking

---

### verifications

**Purpose**: Tracks various verification attempts and statuses for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique verification identifier |
| wallet | varchar | NOT NULL | Associated wallet address |
| verification_type | varchar | - | Type of verification (KYC, POI, etc.) |
| status | varchar | - | Verification status (pending, approved, rejected) |
| provider | varchar | - | Verification service provider |
| provider_id | varchar | - | Provider's verification ID |
| proof_hash | varchar | - | Hash of verification proof |
| score | double precision | - | Verification score/confidence level |
| verified_at | timestamp | - | Verification completion timestamp |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Request creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| expires_at | timestamp | - | Verification expiration timestamp |

**Key Features**:
- Supports multiple verification providers
- Tracks verification lifecycle
- Stores verification scores and proofs

---

## Borrower System

### borrower_features

**Purpose**: ML/AI features and metrics for borrower credit assessment.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique feature record identifier |
| wallet | varchar | NOT NULL, UNIQUE | Borrower's wallet address |
| credit_score | integer | - | Calculated credit score (0-850) |
| default_count | integer | DEFAULT 0 | Number of loan defaults |
| repayment_history | double precision | - | Historical repayment rate (0-1) |
| total_borrowed | double precision | DEFAULT 0 | Lifetime total borrowed amount |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Key Features**:
- Machine learning feature storage
- Credit score calculation inputs
- Historical performance tracking

---

### credit_profiles

**Purpose**: Comprehensive credit limits and risk assessment for borrowers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique credit profile identifier |
| wallet | varchar | NOT NULL, UNIQUE | Borrower's wallet address |
| tier | integer | DEFAULT 1 | Credit tier level |
| credit_score | integer | - | Current credit score |
| risk_points | integer | DEFAULT 0 | Accumulated risk points |
| risk_state | varchar | DEFAULT 'healthy' | Risk status (healthy, warning, critical) |
| max_borrow_amount | double precision | DEFAULT 0 | Maximum total borrowing capacity |
| max_loan_amount | double precision | DEFAULT 0 | Maximum single loan amount |
| max_duration_days | integer | DEFAULT 30 | Maximum loan duration allowed |
| grace_days | integer | DEFAULT 7 | Grace period for late payments |
| available_credit | double precision | DEFAULT 0 | Currently available credit |
| utilization_rate | double precision | DEFAULT 0 | Credit utilization percentage (0-1) |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Profile creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Key Features**:
- Dynamic credit limit management
- Risk state tracking
- Tier-based borrowing limits
- Real-time credit availability

---

### defaults_registry

**Purpose**: Records and tracks loan defaults for credit history.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique default record identifier |
| wallet | varchar | - | Defaulted borrower's wallet |
| loan_id | varchar | - | Reference to defaulted loan |
| chain_id | integer | DEFAULT 1 | Blockchain network ID |
| principal | double precision | - | Original loan principal amount |
| default_ts | timestamp | - | Default occurrence timestamp |
| tx_hash | varchar | - | Blockchain transaction hash |
| resolved | boolean | DEFAULT false | Whether default was resolved |
| resolution_ts | timestamp | - | Resolution timestamp |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Key Features**:
- Permanent default history
- Resolution tracking
- On-chain verification via tx_hash

---

### risk_actions

**Purpose**: Records risk management actions taken on user accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique action identifier |
| wallet | varchar | NOT NULL | Affected wallet address |
| action | varchar | - | Action type (suspend, restrict, etc.) |
| reason | text | - | Detailed reason for action |
| starts_at | timestamp | - | Action start time |
| ends_at | timestamp | - | Action end time (if temporary) |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Key Features**:
- Audit trail for risk actions
- Temporary and permanent restrictions
- Detailed reasoning documentation

---

## Lender System

### lender_profiles

**Purpose**: Lender preferences and lending criteria configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique lender profile identifier |
| wallet | varchar | NOT NULL, UNIQUE | Lender's wallet address |
| active | boolean | DEFAULT true | Whether lender is actively lending |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Profile creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| min_tier | integer | DEFAULT 1 | Minimum borrower tier accepted |
| min_score | integer | - | Minimum credit score required |
| max_duration_days | integer | DEFAULT 30 | Maximum loan duration offered |
| max_amount_per_loan | double precision | DEFAULT 100000 | Maximum single loan amount |
| base_apr_bps | integer | DEFAULT 500 | Base APR in basis points (500 = 5%) |
| insurance_required | boolean | DEFAULT false | Whether insurance is mandatory |

**Key Features**:
- Flexible lending criteria
- Risk tolerance configuration
- Interest rate settings
- Insurance requirements

---

### lender_loan_options

**Purpose**: Specific loan offerings created by lenders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique loan option identifier |
| lender_id | integer | - | Reference to lender profile |
| lender_wallet | varchar | NOT NULL | Lender's wallet address |
| duration_days | integer | NOT NULL | Loan duration offered |
| min_amount | double precision | NOT NULL, DEFAULT 0 | Minimum loan amount |
| amount_available | double precision | NOT NULL, DEFAULT 0 | Available liquidity for this option |
| active | boolean | DEFAULT true | Whether option is currently available |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Option creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Key Features**:
- Multiple loan types per lender
- Real-time availability tracking
- Duration-based offerings

---

## Insurer System

### insurer_profiles

**Purpose**: Insurer configuration and coverage parameters.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique insurer profile identifier |
| wallet | varchar | NOT NULL, UNIQUE | Insurer's wallet address |
| active | boolean | DEFAULT true | Whether actively providing insurance |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Profile creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| min_tier | integer | DEFAULT 1 | Minimum borrower tier to insure |
| min_score | integer | - | Minimum credit score to insure |
| premium_bps | integer | DEFAULT 100 | Premium rate in basis points (100 = 1%) |
| max_coverage_amount | double precision | DEFAULT 1000000 | Maximum coverage per loan |

**Key Features**:
- Risk-based insurance criteria
- Premium rate configuration
- Coverage limits

---

## Loan Management

### loan_intents

**Purpose**: Borrower loan requests before matching and finalization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique intent identifier |
| borrower_wallet | varchar | NOT NULL | Borrower's wallet address |
| offer_id | varchar | - | Reference to lender offer |
| amount | double precision | NOT NULL | Requested loan amount |
| duration_days | integer | - | Requested loan duration |
| chosen_lender_wallet | varchar | - | Selected lender (if any) |
| chosen_insurer_wallet | varchar | - | Selected insurer (if any) |
| apr_bps | integer | - | Agreed APR in basis points |
| premium_bps | integer | - | Agreed premium in basis points |
| status | varchar | DEFAULT 'created' | Intent status (created, matched, expired, completed) |
| expires_at | timestamp | - | Intent expiration time |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Intent creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Key Features**:
- Pre-loan matching stage
- Lender/insurer selection
- Time-limited intents
- Rate negotiation tracking

---

### loans

**Purpose**: Active and completed loan records with full lifecycle tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique loan record identifier |
| loan_id | varchar | NOT NULL, UNIQUE | Blockchain-generated loan ID |
| borrower_wallet | varchar | NOT NULL | Borrower's wallet address |
| lender_wallet | varchar | - | Lender's wallet address |
| insurer_wallet | varchar | - | Insurer's wallet address (if insured) |
| principal | double precision | - | Loan principal amount |
| interest_amount | double precision | - | Total interest amount |
| insurance_premium | double precision | - | Insurance premium amount |
| duration_days | integer | - | Loan duration in days |
| status | varchar | DEFAULT 'active' | Loan status (active, repaid, defaulted, etc.) |
| grace_end_ts | timestamp | - | End of grace period |
| tx_repay_hash | varchar | - | Repayment transaction hash |
| tx_default_hash | varchar | - | Default transaction hash |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Loan creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| chain_id | integer | DEFAULT 1 | Blockchain network ID |
| apr_bps | integer | - | APR in basis points |
| premium_bps | integer | - | Premium in basis points |
| collateral | double precision | - | Collateral amount (if any) |
| start_ts | timestamp | - | Loan start timestamp |
| due_ts | timestamp | - | Loan due timestamp |
| tx_create_hash | varchar | - | Loan creation transaction hash |
| borrower_id | integer | FOREIGN KEY (users.id) | Reference to borrower user |
| lender_id | integer | FOREIGN KEY (users.id) | Reference to lender user |
| selected_option_id | integer | FOREIGN KEY (lender_loan_options.id) | Reference to selected loan option |

**Key Features**:
- Comprehensive loan lifecycle tracking
- Multi-party loan structure (borrower, lender, insurer)
- On-chain transaction verification
- Status state machine
- Grace period support

---

### loan_events

**Purpose**: Audit log of all loan-related events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique event identifier |
| type | varchar | - | Event type (created, funded, repaid, defaulted, etc.) |
| loan_id | varchar | - | Reference to loan |
| wallet | varchar | - | Wallet that triggered event |
| event_ts | timestamp | - | Event occurrence timestamp |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Key Features**:
- Complete audit trail
- Event timeline reconstruction
- Actor tracking

---

## Liquidity Management

### liquidity_positions

**Purpose**: Tracks available and locked liquidity for lenders and insurers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique position identifier |
| provider_wallet | varchar | NOT NULL | Liquidity provider's wallet |
| role | varchar | - | Provider role (lender, insurer) |
| chain_id | integer | DEFAULT 1 | Blockchain network ID |
| asset | varchar | DEFAULT 'ETH' | Asset type (ETH, USDC, etc.) |
| amount_available | double precision | DEFAULT 0 | Available liquidity |
| amount_locked | double precision | DEFAULT 0 | Locked in active loans |
| last_sync_block | integer | DEFAULT 0 | Last blockchain sync block number |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Position creation timestamp |
| updated_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Key Features**:
- Real-time liquidity tracking
- Multi-asset support
- Blockchain synchronization
- Available vs. locked distinction

---

## Relationships

### Entity Relationship Diagram

```
users (1) ←→ (many) profiles
users (1) ←→ (many) wallets
users (1) ←→ (many) loans (as borrower)
users (1) ←→ (many) loans (as lender)

lender_loan_options (1) ←→ (many) loans

wallets (1) ←→ (many) verifications
wallets (1) ←→ (1) borrower_features
wallets (1) ←→ (1) credit_profiles
wallets (1) ←→ (1) lender_profiles
wallets (1) ←→ (1) insurer_profiles
wallets (1) ←→ (many) liquidity_positions
wallets (1) ←→ (many) defaults_registry
wallets (1) ←→ (many) risk_actions
wallets (1) ←→ (many) loan_intents
wallets (1) ←→ (many) loan_events
```

### Key Foreign Key Relationships

1. **profiles.user_id** → users.id
2. **wallets.user_id** → users.id
3. **loans.borrower_id** → users.id
4. **loans.lender_id** → users.id
5. **loans.selected_option_id** → lender_loan_options.id

---

## Data Flow Examples

### Borrower Loan Request Flow

1. Borrower creates entry in `loan_intents`
2. System checks `credit_profiles` for eligibility
3. Matches with available `lender_loan_options`
4. Creates entry in `loans` table
5. Updates `liquidity_positions` (locks funds)
6. Logs event in `loan_events`

### Loan Repayment Flow

1. Update `loans.status` to 'repaid'
2. Record `loans.tx_repay_hash`
3. Update `borrower_features` (increment repayment_history)
4. Update `credit_profiles` (increase available_credit)
5. Update `liquidity_positions` (unlock funds)
6. Log event in `loan_events`

### Default Handling Flow

1. Update `loans.status` to 'defaulted'
2. Create entry in `defaults_registry`
3. Update `borrower_features.default_count`
4. Update `credit_profiles.risk_points`
5. Potentially create `risk_actions` entry
6. Log event in `loan_events`

---

## Indexes Recommendations

For optimal performance, consider adding indexes on:

- `loans.borrower_wallet`, `loans.lender_wallet`, `loans.status`
- `credit_profiles.wallet`, `credit_profiles.tier`
- `lender_loan_options.lender_wallet`, `lender_loan_options.active`
- `loan_intents.borrower_wallet`, `loan_intents.status`
- `verifications.wallet`, `verifications.status`
- `liquidity_positions.provider_wallet`, `liquidity_positions.role`

---

## Notes

- All monetary amounts are stored as `double precision` (consider decimal type for production)
- Basis points (bps) are used for percentages (100 bps = 1%)
- Timestamps use `timestamp without time zone` - ensure consistent timezone handling
- JSONB used for flexible metadata storage in `profiles.meta`
- Most tables include `created_at` and `updated_at` for audit purposes
- Wallet addresses are stored as `varchar` (consider length constraints)

---

**Last Updated**: February 15, 2026  
**Schema Version**: 1.0
