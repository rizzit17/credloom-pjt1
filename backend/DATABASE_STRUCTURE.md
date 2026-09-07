# Credloom Database Structure

This document describes the complete database schema for the Credloom platform on Supabase.

## Overview

The Credloom platform uses PostgreSQL via Supabase with the following main entity groups:
- **User Management**: users, profiles, wallets, verifications
- **Credit & Risk**: credit_profiles, borrower_features, risk_actions, defaults_registry
- **Lending**: lender_profiles, lender_loan_options, liquidity_positions
- **Insurance**: insurer_profiles
- **Loans**: loans, loan_intents, loan_events

---

## Core Tables

### `users`
Primary user account table for authentication and management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Unique user ID |
| `primary_wallet` | varchar | NOT NULL, UNIQUE | Primary wallet address |
| `username` | varchar | UNIQUE | User's chosen username |
| `password_hash` | varchar | | Hashed password |
| `email` | varchar | | Email address |
| `status` | varchar | DEFAULT 'active' | Account status |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

**Indexes**: `primary_wallet` (unique), `username` (unique)

---

### `profiles`
Extended user profile information including KYC data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Profile ID |
| `wallet` | varchar | NOT NULL, UNIQUE | Wallet address |
| `user_id` | integer | FK → users(id) | Reference to user |
| `tier` | integer | DEFAULT 1 | Verification tier (1-3) |
| `tier_selected_at` | timestamp | | When tier was selected |
| `display_handle` | varchar | | Display name |
| `country_code` | varchar | | Country code |
| `first_name` | varchar | | First name |
| `last_name` | varchar | | Last name |
| `dob` | varchar | | Date of birth |
| `country` | varchar | | Country |
| `tax_id` | varchar | | Tax ID |
| `meta` | jsonb | | Additional metadata |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

**Relationships**: 
- `user_id` → `users.id`

---

### `wallets`
Multi-wallet support for users across different chains.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Wallet ID |
| `wallet` | varchar | NOT NULL, UNIQUE | Wallet address |
| `user_id` | integer | FK → users(id) | Owner user ID |
| `chain_id` | integer | DEFAULT 1 | Blockchain chain ID |
| `first_seen_ts` | timestamp | | First activity timestamp |
| `last_seen_ts` | timestamp | | Last activity timestamp |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

**Relationships**: 
- `user_id` → `users.id`

---

## Credit & Risk Management

### `credit_profiles`
**Main credit scoring and risk assessment table.**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Profile ID |
| `wallet` | varchar | NOT NULL, UNIQUE | Wallet address |
| `tier` | integer | DEFAULT 1 | Verification tier |
| `credit_score` | integer | | Credit score (0-850) |
| `risk_points` | integer | DEFAULT 0 | Accumulated risk points |
| `risk_state` | varchar | DEFAULT 'healthy' | Risk state: healthy/warning/critical |
| `max_borrow_amount` | double | DEFAULT 0 | Maximum borrowing capacity |
| `max_loan_amount` | double | DEFAULT 0 | Maximum single loan amount |
| `max_duration_days` | integer | DEFAULT 30 | Maximum loan duration |
| `grace_days` | integer | DEFAULT 7 | Grace period for defaults |
| `available_credit` | double | DEFAULT 0 | Currently available credit |
| `utilization_rate` | double | DEFAULT 0 | Credit utilization (0-1) |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

**Key Column**: `wallet` (for lookups), `credit_score` (for rate calculations)

---

### `borrower_features`
ML model features and historical borrowing data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Feature ID |
| `wallet` | varchar | NOT NULL, UNIQUE | Wallet address |
| `credit_score` | integer | | Credit score |
| `default_count` | integer | DEFAULT 0 | Number of defaults |
| `repayment_history` | double | | Repayment success rate (0-1) |
| `total_borrowed` | double | DEFAULT 0 | Total amount borrowed |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

---

### `risk_actions`
Risk-based restrictions or actions on accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Action ID |
| `wallet` | varchar | NOT NULL | Target wallet |
| `action` | varchar | | Action type (suspend, limit, etc.) |
| `reason` | text | | Reason for action |
| `starts_at` | timestamp | | Action start time |
| `ends_at` | timestamp | | Action end time |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |

---

### `defaults_registry`
Record of loan defaults for credit scoring.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Default ID |
| `wallet` | varchar | | Defaulting wallet |
| `loan_id` | varchar | | Related loan ID |
| `chain_id` | integer | DEFAULT 1 | Blockchain chain ID |
| `principal` | double | | Principal amount defaulted |
| `default_ts` | timestamp | | Default timestamp |
| `tx_hash` | varchar | | Transaction hash |
| `resolved` | boolean | DEFAULT false | Whether resolved |
| `resolution_ts` | timestamp | | Resolution timestamp |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |

---

## Lender Tables

### `lender_profiles`
Lender configuration and preferences.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Profile ID |
| `wallet` | varchar | NOT NULL, UNIQUE | Lender wallet |
| `active` | boolean | DEFAULT true | Active status |
| `min_tier` | integer | DEFAULT 1 | Minimum borrower tier |
| `min_score` | integer | | Minimum credit score |
| `max_duration_days` | integer | DEFAULT 30 | Max loan duration |
| `max_amount_per_loan` | double | DEFAULT 100000 | Max loan amount |
| `base_apr_bps` | integer | DEFAULT 500 | Base APR in basis points (5%) |
| `insurance_required` | boolean | DEFAULT false | Insurance requirement |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

---

### `lender_loan_options`
Specific loan packages offered by lenders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Option ID |
| `lender_id` | integer | | FK → lender_profiles(id) |
| `lender_wallet` | varchar | NOT NULL | Lender wallet |
| `duration_days` | integer | NOT NULL | Loan duration |
| `min_amount` | double | DEFAULT 0 | Minimum loan amount |
| `amount_available` | double | DEFAULT 0 | Available liquidity |
| `active` | boolean | DEFAULT true | Active status |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

---

### `liquidity_positions`
Tracking of liquidity provider positions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Position ID |
| `provider_wallet` | varchar | NOT NULL | Provider wallet |
| `role` | varchar | | Provider role (lender/insurer) |
| `chain_id` | integer | DEFAULT 1 | Chain ID |
| `asset` | varchar | DEFAULT 'ETH' | Asset type |
| `amount_available` | double | DEFAULT 0 | Available amount |
| `amount_locked` | double | DEFAULT 0 | Locked in loans |
| `last_sync_block` | integer | DEFAULT 0 | Last synced block |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

---

## Insurance Tables

### `insurer_profiles`
Insurance provider configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Profile ID |
| `wallet` | varchar | NOT NULL, UNIQUE | Insurer wallet |
| `active` | boolean | DEFAULT true | Active status |
| `min_tier` | integer | DEFAULT 1 | Minimum borrower tier |
| `min_score` | integer | | Minimum credit score |
| `premium_bps` | integer | DEFAULT 100 | Premium in basis points (1%) |
| `max_coverage_amount` | double | DEFAULT 1000000 | Max coverage per loan |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

---

## Loan Tables

### `loans`
Active and historical loan records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Internal ID |
| `loan_id` | varchar | NOT NULL, UNIQUE | Unique loan identifier |
| `borrower_wallet` | varchar | NOT NULL | Borrower wallet |
| `borrower_id` | integer | FK → users(id) | Borrower user ID |
| `lender_wallet` | varchar | | Lender wallet |
| `lender_id` | integer | FK → users(id) | Lender user ID |
| `insurer_wallet` | varchar | | Insurer wallet |
| `selected_option_id` | integer | FK → lender_loan_options(id) | Selected loan option |
| `principal` | double | | Loan principal amount |
| `interest_amount` | double | | Total interest |
| `insurance_premium` | double | | Insurance premium |
| `collateral` | double | | Collateral amount |
| `duration_days` | integer | | Loan duration |
| `apr_bps` | integer | | APR in basis points |
| `premium_bps` | integer | | Premium in basis points |
| `status` | varchar | DEFAULT 'active' | Status: active/repaid/defaulted |
| `chain_id` | integer | DEFAULT 1 | Blockchain chain ID |
| `start_ts` | timestamp | | Loan start time |
| `due_ts` | timestamp | | Due date |
| `grace_end_ts` | timestamp | | Grace period end |
| `tx_create_hash` | varchar | | Creation transaction |
| `tx_repay_hash` | varchar | | Repayment transaction |
| `tx_default_hash` | varchar | | Default transaction |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

**Relationships**:
- `borrower_id` → `users.id`
- `lender_id` → `users.id`
- `selected_option_id` → `lender_loan_options.id`

---

### `loan_intents`
Borrower loan requests before matching.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Intent ID |
| `borrower_wallet` | varchar | NOT NULL | Borrower wallet |
| `offer_id` | varchar | | Related offer ID |
| `amount` | double | NOT NULL | Requested amount |
| `duration_days` | integer | | Requested duration |
| `chosen_lender_wallet` | varchar | | Selected lender |
| `chosen_insurer_wallet` | varchar | | Selected insurer |
| `apr_bps` | integer | | Agreed APR |
| `premium_bps` | integer | | Agreed premium |
| `status` | varchar | DEFAULT 'created' | Status: created/matched/expired |
| `expires_at` | timestamp | | Expiration time |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

---

### `loan_events`
Audit log of loan lifecycle events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Event ID |
| `type` | varchar | | Event type |
| `loan_id` | varchar | | Related loan ID |
| `wallet` | varchar | | Actor wallet |
| `event_ts` | timestamp | | Event timestamp |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |

---

## Verification Tables

### `verifications`
KYC/identity verification records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PK, AUTO | Verification ID |
| `wallet` | varchar | NOT NULL | Verified wallet |
| `verification_type` | varchar | | Type (KYC, proof of humanity, etc.) |
| `status` | varchar | | Status: pending/verified/rejected |
| `provider` | varchar | | Verification provider |
| `provider_id` | varchar | | Provider's verification ID |
| `proof_hash` | varchar | | Hash of verification proof |
| `score` | double | | Verification confidence score |
| `verified_at` | timestamp | | Verification timestamp |
| `expires_at` | timestamp | | Expiration timestamp |
| `created_at` | timestamp | DEFAULT NOW | Creation timestamp |
| `updated_at` | timestamp | DEFAULT NOW | Last update timestamp |

---

## Common Patterns

### Primary Keys
All tables use auto-incrementing integer `id` as primary key.

### Wallet Identifiers
- Most tables use `wallet` (varchar) for blockchain address lookup
- Wallets are typically UNIQUE where they identify an entity
- Case sensitivity depends on Ethereum address standards (checksummed)

### Timestamps
Standard timestamp columns:
- `created_at`: Record creation (DEFAULT CURRENT_TIMESTAMP)
- `updated_at`: Last modification (DEFAULT CURRENT_TIMESTAMP)
- Domain-specific timestamps: `start_ts`, `due_ts`, `verified_at`, etc.

### Status Fields
Common status patterns:
- `active` (boolean): For profiles and configurations
- `status` (varchar): For state machines (loans, verifications, etc.)
- `risk_state` (varchar): For risk assessment

### Financial Fields
- All amounts stored as `double precision`
- Interest rates and fees in basis points (`_bps` suffix)
  - 100 bps = 1%
  - 500 bps = 5%
- Default values typically `0` for amounts

---

## Key Relationships

```
users
  ├── profiles (user_id)
  ├── wallets (user_id)
  └── loans (borrower_id, lender_id)

wallet (address string) links:
  ├── credit_profiles (wallet)
  ├── borrower_features (wallet)
  ├── lender_profiles (wallet)
  ├── insurer_profiles (wallet)
  ├── risk_actions (wallet)
  ├── defaults_registry (wallet)
  └── liquidity_positions (provider_wallet)

loans
  ├── borrower_id → users.id
  ├── lender_id → users.id
  └── selected_option_id → lender_loan_options.id
```

---

## Query Examples

### Get User Credit Score
```sql
-- From credit_profiles (recommended for calculations)
SELECT credit_score, tier, risk_state, available_credit
FROM credit_profiles
WHERE wallet = 'WALLET_ADDRESS';

-- From borrower_features (for ML features)
SELECT credit_score, default_count, repayment_history
FROM borrower_features
WHERE wallet = 'WALLET_ADDRESS';
```

### Get Active Loans for Borrower
```sql
SELECT l.*, cp.credit_score, cp.tier
FROM loans l
JOIN credit_profiles cp ON l.borrower_wallet = cp.wallet
WHERE l.borrower_wallet = 'WALLET_ADDRESS'
  AND l.status = 'active';
```

### Get Available Lender Options
```sql
SELECT lo.*, lp.base_apr_bps, lp.insurance_required
FROM lender_loan_options lo
JOIN lender_profiles lp ON lo.lender_wallet = lp.wallet
WHERE lo.active = true
  AND lo.amount_available > 0
  AND lp.active = true
  AND lp.min_tier <= USER_TIER
  AND (lp.min_score IS NULL OR lp.min_score <= USER_CREDIT_SCORE);
```

---

## Best Practices

1. **Always use prepared statements** to prevent SQL injection
2. **Use wallet address** as the primary identifier for most operations
3. **Check credit_profiles table** for credit scores, not users table
4. **Update timestamps** on every modification (updated_at)
5. **Use transactions** for multi-table operations (loan creation, etc.)
6. **Validate tier access** before allowing operations
7. **Check risk_actions** before processing loan requests
8. **Index wallet columns** for performance on large tables

---

## API Integration Notes

### Credit Score Lookup
- **Primary source**: `credit_profiles.credit_score`
- **Key**: Use `wallet` address, not `user_id`
- **Fallback**: Check `borrower_features.credit_score` if needed

### Interest Rate Calculation
1. Query `credit_profiles` by `wallet`
2. Extract `credit_score` value
3. Calculate rate based on score ranges
4. Consider `tier`, `risk_state`, and `risk_points` for adjustments

### Loan Creation Flow
1. Validate borrower via `credit_profiles`
2. Check `risk_actions` for restrictions
3. Select from available `lender_loan_options`
4. Create `loan_intents` entry
5. Finalize in `loans` table
6. Log to `loan_events`

---

*Last Updated: February 14, 2026*
