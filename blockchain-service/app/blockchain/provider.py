from web3 import Web3
from app.config import RPC_URL

w3 = Web3(Web3.HTTPProvider(RPC_URL))

if not w3.is_connected():
    raise RuntimeError("Failed to connect to blockchain RPC")
