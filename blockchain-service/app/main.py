from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(title="CredLoom Blockchain Service")

# ---------------------------------------------------------
# CORS CONFIGURATION
# ---------------------------------------------------------
# This allows the Frontend (localhost:3000) to talk to this Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (change to ["http://localhost:3000"] in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# ---------------------------------------------------------
# ROUTER & HEALTH CHECK
# ---------------------------------------------------------
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "CredLoom Blockchain Service is running", "cors": "enabled"}