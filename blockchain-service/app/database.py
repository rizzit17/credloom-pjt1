import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("❌ Supabase credentials missing in .env")

# Initialize Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_user_id_by_wallet(wallet_address: str):
    """Helper: Finds user ID by wallet."""
    try:
        response = supabase.table("users").select("id").eq("primary_wallet", wallet_address).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]['id']
        return None
    except Exception as e:
        print(f"⚠️ Error fetching user ID: {e}")
        return None

def create_loan_proposal(offer_id, lender_wallet, amount_eth, duration_days, min_credit_score):
    """Saves a new Lender Offer."""
    try:
        lender_id = get_user_id_by_wallet(lender_wallet)
        data = {
            "chain_offer_id": offer_id,
            "lender_wallet": lender_wallet,
            "lender_id": lender_id,
            "amount_available": amount_eth,
            "min_amount": amount_eth,
            "duration_days": duration_days,
            "min_score": min_credit_score,
            "active": True
        }
        response = supabase.table("lender_loan_options").insert(data).execute()
        return response.data
    except Exception as e:
        print(f"❌ Failed to save proposal: {e}")

def get_active_offers():
    """Fetches offers for Marketplace."""
    try:
        response = supabase.table("lender_loan_options").select("*").eq("active", True).execute()
        return response.data
    except Exception as e:
        print(f"❌ DB Error: {e}")
        return []

def finalize_loan_acceptance(
    chain_offer_id: int,
    blockchain_loan_id: str,
    borrower_wallet: str,
    interest_rate: float,
    tx_hash: str,
    is_insured: bool,
    insurer_wallet: str
):
    """
    UPDATES the existing 'selected' loan row with final blockchain details.
    """
    try:
        # 1. Fetch the Offer details
        offer_res = supabase.table("lender_loan_options").select("*").eq("chain_offer_id", chain_offer_id).single().execute()
        if not offer_res.data:
            print(f"❌ Offer {chain_offer_id} not found in DB")
            return False
        
        offer = offer_res.data
        principal = float(offer['amount_available'])
        duration = int(offer['duration_days'])
        lender_wallet = offer['lender_wallet']
        lender_id = offer['lender_id']
        option_id = offer['id']

        # 2. Update Borrower Stats
        prof_res = supabase.table("profiles").select("*").eq("wallet", borrower_wallet).execute()
        if prof_res.data:
            current = prof_res.data[0]
            supabase.table("profiles").update({
                "total_transactions": (current.get('total_transactions') or 0) + 1,
                "num_previous_loans": (current.get('num_previous_loans') or 0) + 1,
                "total_previous_loans_eth": (current.get('total_previous_loans_eth') or 0.0) + principal,
                "updated_at": datetime.now().isoformat()
            }).eq("wallet", borrower_wallet).execute()

        # 3. Calculate Financials
        start_date = datetime.now()
        due_date = start_date + timedelta(days=duration)
        interest_amount = (principal * interest_rate) / 100.0
        apr_bps = int(interest_rate * 100)
        
        premium_bps = 100 if is_insured else 0 
        insurance_amount = (principal * premium_bps) / 10000.0 if is_insured else 0

        # 4. Prepare Data Payload
        loan_update_data = {
            "blockchain_loan_id": str(blockchain_loan_id), # Store Chain ID separately
            "status": "active",
            "tx_create_hash": tx_hash,
            
            # Financials
            "principal": principal,
            "interest_amount": interest_amount,
            "insurance_premium": insurance_amount, # Fixed: matched your DB column name
            "apr_bps": apr_bps,
            "premium_bps": premium_bps,
            "start_ts": start_date.isoformat(),
            "due_ts": due_date.isoformat(),
        }
        
        if is_insured:
            loan_update_data["insurer_wallet"] = insurer_wallet

        # 5. FIND AND UPDATE (The Key Fix)
        # We look for a row that is "selected" and matches this offer
        existing_loan = supabase.table("loans").select("*")\
            .eq("borrower_wallet", borrower_wallet)\
            .eq("selected_option_id", option_id)\
            .eq("status", "selected")\
            .execute()

        if existing_loan.data:
            # Update the existing draft
            loan_pk = existing_loan.data[0]['id']
            supabase.table("loans").update(loan_update_data).eq("id", loan_pk).execute()
            print(f"✅ Updated existing loan draft {loan_pk}")
        else:
            # Fallback: Insert new if no draft found
            print("⚠️ No draft found, inserting new record")
            loan_update_data["loan_id"] = str(blockchain_loan_id) # Use chain ID as ID if inserting
            loan_update_data["borrower_wallet"] = borrower_wallet
            loan_update_data["lender_wallet"] = lender_wallet
            loan_update_data["lender_id"] = lender_id
            loan_update_data["selected_option_id"] = option_id
            # Fetch borrower ID only if inserting
            b_id = get_user_id_by_wallet(borrower_wallet)
            if b_id: loan_update_data["borrower_id"] = b_id
            
            supabase.table("loans").insert(loan_update_data).execute()

        # 6. Close the Offer
        supabase.table("lender_loan_options").update({"active": False}).eq("chain_offer_id", chain_offer_id).execute()
        
        return True

    except Exception as e:
        print(f"❌ DB Finalization Error: {e}")
        return False