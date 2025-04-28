from fastapi import APIRouter, Depends
from auth.auth_utils import get_current_user
from database.mongo import articles

# API Router
router = APIRouter()

@router.get("/by-subfield")
async def get_articles_by_subfield(user: dict = Depends(get_current_user)):
    user_subfields = user.get("subfields", [])

    if not user_subfields:
        return []

    # MongoDB'den Türkçe subfields'e göre makaleleri çek
    results = list(articles.find({"tags": {"$in": user_subfields}}))
    for r in results:
        r["_id"] = str(r["_id"])
    return results