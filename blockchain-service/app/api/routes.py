from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.blockchain.adapter import (
    accept_offer,
    trigger_default,
    is_borrower_flagged,
    get_offer_amount,
    create_offer_custodial,
    get_balance_wei,
    # We need w3 to convert addresses
    w3 
)
from app.blockchain.contracts import liquidity_pool, loan_escrow
from app.database import create_loan_proposal, get_active_offers, finalize_loan_acceptance

router = APIRouter()

# ---------------------------------------------------------
# HELPER: FORCE CHECKSUM ADDRESS
# ---------------------------------------------------------
def to_checksum(address: str) -> str:
    """
    Converts any address (lowercase or mixed) to a valid EIP-55 Checksum Address.
    Fixes the 'Web3.py only accepts checksum addresses' error.
    """
    try:
        return w3.to_checksum_address(address)
    except Exception:
        # If it's not a valid address at all, let Web3 throw the error later
        return address

# ---------------------------------------------------------
# 1. LENDER: Create Offer
# ---------------------------------------------------------
class CreateOfferRequest(BaseModel):
    lenderAddress: str
    amountEth: float
    durationDays: int
    minCreditScore: int

@router.post("/lender/create-offer")
def create_offer_endpoint(payload: CreateOfferRequest):
    try:
        # FIX: Convert lender address
        clean_lender = to_checksum(payload.lenderAddress)
        
        duration_seconds = payload.durationDays * 86400
        result = create_offer_custodial(
            lender_address=clean_lender, 
            duration=duration_seconds,
            min_credit_score=payload.minCreditScore,
            amount_eth=payload.amountEth
        )
        # Supabase update
        create_loan_proposal(
            offer_id=result["offerId"],
            lender_wallet=clean_lender,
            amount_eth=payload.amountEth,
            duration_days=payload.durationDays,
            min_credit_score=payload.minCreditScore
        )
        return {"success": True, "txHash": result["txHash"], "offerId": result["offerId"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------------------------
# 2. MARKETPLACE: Get Offers
# ---------------------------------------------------------
@router.get("/market/offers")
def get_open_offers_api():
    try:
        offers = get_active_offers()
        formatted_offers = []
        for o in offers:
            formatted_offers.append({
                "offerId": o["chain_offer_id"],
                "lender": o["lender_wallet"],
                "amountEth": o["amount_available"],
                "durationDays": o["duration_days"],
                "minCreditScore": o["min_score"]
            })
        return {"offers": formatted_offers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------------------------
# 3. BORROWER: Accept Offer
# ---------------------------------------------------------
@router.post("/loan/accept")
def accept_offer_api(payload: dict):
    required = ["offerId", "borrower", "interestRate", "isInsured", "insurer"]
    for field in required:
        if field not in payload:
            raise HTTPException(status_code=400, detail=f"Missing {field}")

    offer_id = payload["offerId"]
    interest_rate = payload["interestRate"]
    
    # FIX: Convert addresses
    clean_borrower = to_checksum(payload["borrower"])
    clean_insurer = to_checksum(payload["insurer"])

    try:
        # 1. Fetch Principal from Chain (Source of Truth)
        principal_wei = get_offer_amount(offer_id)
        # Calculate interest in Wei for the Blockchain
        interest_wei = int(principal_wei * interest_rate / 100)
        
        # 2. Blockchain Execution
        blockchain_result = accept_offer(
            offer_id=offer_id,
            borrower=clean_borrower,
            interest=interest_wei,
            is_insured=payload["isInsured"],
            insurer=clean_insurer
        )
        
        # 3. Database Finalization
        db_success = finalize_loan_acceptance(
            chain_offer_id=offer_id,
            blockchain_loan_id=blockchain_result["blockchainLoanId"],
            borrower_wallet=clean_borrower,
            interest_rate=interest_rate,
            tx_hash=blockchain_result["txHash"],
            is_insured=payload["isInsured"],
            insurer_wallet=clean_insurer
        )

        return {
            "success": True, 
            "txHash": blockchain_result["txHash"],
            "loanId": blockchain_result["blockchainLoanId"],
            "db_updated": db_success
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------------------------
# 4. UTILITIES (Default, Flag Check)
# ---------------------------------------------------------
@router.post("/loan/default/{loan_id}")
def default_loan(loan_id: int):
    try:
        return {"txHash": trigger_default(loan_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/borrower/{address}/flagged")
def borrower_flagged(address: str):
    # FIX: Convert address
    clean_addr = to_checksum(address)
    return {"flagged": is_borrower_flagged(clean_addr)}

# ---------------------------------------------------------
# 5. BALANCE & SYSTEM CHECKS
# ---------------------------------------------------------
@router.get("/balance/{address}")
def get_address_balance(address: str):
    """Returns the ETH balance of any address."""
    try:
        # FIX: Convert address
        clean_addr = to_checksum(address)
        wei = get_balance_wei(clean_addr)
        eth = float(wei) / 10**18
        return {
            "address": clean_addr,
            "balanceWei": wei,
            "balanceEth": eth
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/system/contracts")
def get_contract_addresses():
    """Returns deployed system contract addresses."""
    return {
        "LiquidityPool": liquidity_pool.address,
        "LoanEscrow": loan_escrow.address
    }