import json
from app.blockchain.provider import w3
from app.config import (
    LOAN_ESCROW_ADDRESS,
    INSURANCE_POOL_ADDRESS,
    REPUTATION_REGISTRY_ADDRESS,
    LIQUIDITY_POOL_ADDRESS
)

def load_abi(name: str):
    with open(f"abi/{name}.json") as f:
        return json.load(f)

loan_escrow = w3.eth.contract(
    address=LOAN_ESCROW_ADDRESS,
    abi=load_abi("LoanEscrow")
)

insurance_pool = w3.eth.contract(
    address=INSURANCE_POOL_ADDRESS,
    abi=load_abi("InsurancePool")
)

reputation_registry = w3.eth.contract(
    address=REPUTATION_REGISTRY_ADDRESS,
    abi=load_abi("ReputationRegistry")
)

liquidity_pool = w3.eth.contract(
    address=LIQUIDITY_POOL_ADDRESS,
    abi=load_abi("LenderLiquidityPool")
)
