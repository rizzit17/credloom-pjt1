# Credloom Backend API

Node.js + Express backend for Credloom with Supabase integration.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     ```
     SUPABASE_URL=your_supabase_url_here
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
     PORT=3000
     ```

3. **Database Setup:**
   - Make sure your Supabase database has a `credit_profiles` table with the following columns:
     - `wallet` (varchar) - Primary identifier
     - `credit_score` (integer) - Credit score (0-850)
     - `tier` (integer) - Verification tier
     - `risk_state` (varchar) - Risk assessment state
   - See [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md) for complete schema documentation

## Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints
wallet`

Calculate and return the interest rate for a user based on their credit score from the `credit_profiles` table.

**Parameters:**
- `wallet` (path parameter) - The user's wallet address (e.g., 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1)

**Success Response:**
```json
{
  "interestRate": "8.50",
  "creditScore": 720,
  "tier": 2,
  "riskState": "healthy",
  "availableCredit": 50000,
  "maxLoanAmount": 25000
}
```

**Error Responses:**
- `400` - Invalid wallet address format or credit score not available
- `403` - Account in critical risk state (lending restricted)
- `404` - Credit profile not found for wallet
**Error Responses:**
- `404` - User not found
- `400` - Credit score not available
- `500` - Server error

### Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "ok"
}
```

## Interest Rate Calculation Logic

The interest rate is calculated based on credit score ranges:

- **Credit score 750-850:** 5-8% interest
- **Credit score 650-749:** 8-12% interest
- **Credit score 550-649:** 12-18% interest
# Example with a wallet address
curl -X POST http://localhost:3000/user/getrate/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1
```

Or using tools like Postman or Insomnia.

**Note:** Make sure the wallet address exists in your `credit_profiles` table with a valid `credit_score` value
## Testing

You can test the endpoint using curl:

```bash
curl -X POST http://localhost:3000/user/getrate/YOUR_USER_ID
```

Or using tools like Postman or Insomnia.

## Project Structure

```
backend/
├── index.js              # Main server file with routes and logic
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (not in git)
├── .env.example          # Example environment variables
├── DATABASE_STRUCTURE.md # Complete database schema documentation
└── README.md             # This file
```

## Database Documentation

For complete database schema documentation including all tables, relationships, and query examples, see [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md).
