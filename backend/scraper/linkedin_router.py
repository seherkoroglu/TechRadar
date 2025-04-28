from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AccessTokenRequest(BaseModel):
    access_token: str

@router.post("/get-profile", tags=["LinkedIn"])
async def get_profile(data: AccessTokenRequest):
    return {"status": "Başarılı", "access_token_kisaltildi": data.access_token[:10]}
