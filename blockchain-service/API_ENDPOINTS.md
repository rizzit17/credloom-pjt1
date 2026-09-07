# CredLoom Blockchain Service - API Documentation

## Overview
The CredLoom Blockchain Service provides RESTful API endpoints for managing blockchain-based lending operations, including creating loan offers, accepting loans, managing defaults, and checking borrower reputation.

**Base URL**: `http://localhost:<port>`  
**Framework**: FastAPI

---

## Endpoints

### 1. Create Loan Offer (Lender)

**POST** `/lender/create-offer`

Creates a new loan offer on behalf of a lender. The offer is created on the blockchain via the LiquidityPool contract and tracked in the database.

#### Request Body
```json
{
  "lenderAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "amountEth": 5.0,
  "durationDays": 30,
  "minCreditScore": 650
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lenderAddress` | string | Yes | Ethereum address of the lender (must be in demo wallets for custodial mode) |
| `amountEth` | float | Yes | Loan amount in ETH |
| `durationDays` | integer | Yes | Loan duration in days (converted to seconds: days × 86400) |
| `minCreditScore` | integer | Yes | Minimum credit score required for borrowers |

#### Success Response (200)
```json
{
  "success": true,
  "txHash": "0x1234567890abcdef...",
  "offerId": 1
}
```

#### Response Schema
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Operation status |
| `txHash` | string | Blockchain transaction hash |
| `offerId` | integer | Unique offer ID from blockchain event |

#### Error Response (500)
```json
{
  "detail": "Error message describing what went wrong"
}
```

#### Blockchain Operations
- Calls `LiquidityPool.createOffer(duration, minCreditScore)` with `value: amountEth`
- Emits `OfferCreated` event containing `offerId`
- Updates Supabase `loan_proposals` table

---

### 2. Get Active Offers (Market)

**GET** `/market/offers`

Retrieves all active loan offers available in the marketplace.

#### Request Parameters
None

#### Success Response (200)
```json
{
  "offers": [
    {
      "offerId": 1,
      "lender": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "amountEth": 5.0,
      "durationDays": 30,
      "minCreditScore": 650
    },
    {
      "offerId": 2,
      "lender": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "amountEth": 10.0,
      "durationDays": 60,
      "minCreditScore": 700
    }
  ]
}
```

#### Response Schema
| Field | Type | Description |
|-------|------|-------------|
| `offers` | array | List of active loan offers |
| `offers[].offerId` | integer | Unique offer ID from blockchain |
| `offers[].lender` | string | Lender's Ethereum address |
| `offers[].amountEth` | float | Available loan amount in ETH |
| `offers[].durationDays` | integer | Loan duration in days |
| `offers[].minCreditScore` | integer | Minimum required credit score |

#### Error Response (500)
```json
{
  "detail": "Error message describing database or retrieval issue"
}
```

#### Data Source
- Queries Supabase `loan_proposals` table for active offers
- Filters for status `'active'` (not accepted or expired)

---

### 3. Accept Loan Offer (Borrower)

**POST** `/loan/accept`

Accepts a loan offer on behalf of a borrower. Executes blockchain transaction, creates loan escrow, and updates database.

#### Request Body
```json
{
  "offerId": 1,
  "borrower": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "interestRate": 15.5,
  "isInsured": true,
  "insurer": "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `offerId` | integer | Yes | ID of the offer to accept |
| `borrower` | string | Yes | Borrower's Ethereum address |
| `interestRate` | float | Yes | Agreed interest rate (percentage, e.g., 15.5 for 15.5%) |
| `isInsured` | boolean | Yes | Whether the loan is insured |
| `insurer` | string | Yes | Insurer's Ethereum address (can be zero address if not insured) |

#### Success Response (200)
```json
{
  "success": true,
  "txHash": "0xabcdef1234567890...",
  "loanId": "42",
  "db_updated": true
}
```

#### Response Schema
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Operation status |
| `txHash` | string | Blockchain transaction hash |
| `loanId` | string | Unique loan ID from blockchain event |
| `db_updated` | boolean | Database synchronization status |

#### Error Responses
**400 - Missing Required Field**
```json
{
  "detail": "Missing offerId"
}
```

**500 - Execution Error**
```json
{
  "detail": "Error message from blockchain or database"
}
```

#### Processing Steps
1. **Fetch Principal**: Retrieves offer amount from blockchain via `LiquidityPool.offers(offerId)`
2. **Calculate Interest**: `interest_wei = principal_wei × interestRate / 100`
3. **Blockchain Execution**: Calls `LiquidityPool.acceptOffer(offerId, borrower, interest, isInsured, insurer)`
4. **Emit Event**: Blockchain emits `OfferAccepted` event with `loanId`
5. **Database Update**: Updates `loan_proposals` status and creates entry in `loans` table

---

### 4. Trigger Loan Default

**POST** `/loan/default/{loan_id}`

Marks a loan as defaulted on the blockchain. This is typically called when a borrower fails to repay.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `loan_id` | integer | Yes | Blockchain loan ID to mark as defaulted |

#### Request Example
```
POST /loan/default/42
```

#### Request Body
None

#### Success Response (200)
```json
{
  "txHash": "0x9876543210fedcba..."
}
```

#### Response Schema
| Field | Type | Description |
|-------|------|-------------|
| `txHash` | string | Blockchain transaction hash for the default action |

#### Error Response (500)
```json
{
  "detail": "Error executing blockchain transaction"
}
```

#### Blockchain Operations
- Calls `LoanEscrow.markDefault(loanId)` contract function
- Updates borrower's reputation on-chain
- May trigger collateral liquidation (depending on contract logic)

---

### 5. Check Borrower Flagged Status

**GET** `/borrower/{address}/flagged`

Checks if a borrower address is flagged in the reputation registry (typically due to previous defaults).

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | Ethereum address of the borrower to check |

#### Request Example
```
GET /borrower/0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC/flagged
```

#### Success Response (200)
```json
{
  "flagged": false
}
```

or

```json
{
  "flagged": true
}
```

#### Response Schema
| Field | Type | Description |
|-------|------|-------------|
| `flagged` | boolean | `true` if borrower has defaulted before, `false` otherwise |

#### Data Source
- Queries `ReputationRegistry.isBorrowerFlagged(address)` on blockchain
- Pure read operation (no gas cost)

---

## Smart Contract Integration

### Contracts Used
1. **LiquidityPool** - Manages loan offers and acceptance
2. **LoanEscrow** - Handles active loans and defaults
3. **ReputationRegistry** - Tracks borrower credit history

### Custodial Mode
The service operates in custodial mode using demo wallets:
- Lender transactions are signed using private keys from the demo wallet mapping
- System account signs accept/default transactions on behalf of the platform
- 20 demo wallets are pre-configured with private keys

---

## Database Schema

### Tables Updated
1. **loan_proposals** - Stores all created offers
2. **loans** - Stores accepted loans with blockchain loan IDs
3. Both tables synchronized with blockchain events

---

## Error Handling

All endpoints use standard HTTP status codes:
- **200**: Successful operation
- **400**: Bad request (missing required fields)
- **500**: Internal server error (blockchain transaction failure, database error, etc.)

Error responses follow the format:
```json
{
  "detail": "Human-readable error message"
}
```

---

## Testing Example Workflows

### Workflow 1: Lender Creates Offer
```bash
curl -X POST http://localhost:8000/lender/create-offer \
  -H "Content-Type: application/json" \
  -d '{
    "lenderAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "amountEth": 5.0,
    "durationDays": 30,
    "minCreditScore": 650
  }'
```

### Workflow 2: Browse Market Offers
```bash
curl -X GET http://localhost:8000/market/offers
```

### Workflow 3: Borrower Accepts Offer
```bash
curl -X POST http://localhost:8000/loan/accept \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": 1,
    "borrower": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "interestRate": 15.5,
    "isInsured": true,
    "insurer": "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
  }'
```

### Workflow 4: Check Borrower Reputation
```bash
curl -X GET http://localhost:8000/borrower/0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC/flagged
```

### Workflow 5: Mark Loan as Defaulted
```bash
curl -X POST http://localhost:8000/loan/default/42
```

---

## Notes

- All blockchain operations require a local Ethereum node or connection to a test network
- Transaction gas costs are automatically calculated using current network gas prices
- Demo wallet addresses must be used for lender operations in custodial mode
- Interest calculations are performed server-side for accuracy
- All amounts are converted between ETH (user-facing) and Wei (blockchain) automatically
