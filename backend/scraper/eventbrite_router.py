from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
import os
import requests
from serpapi import GoogleSearch
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
import os
from serpapi import GoogleSearch

router = APIRouter()
load_dotenv()
@router.post("/events-search")
async def search_google_events(request: Request):
        body = await request.json()
        keyword = body.get("keyword")

        if not keyword:
            raise HTTPException(status_code=400, detail="Keyword gerekli.")

        serpapi_key = os.getenv("SERPAPI_KEY")
        if not serpapi_key:
            raise HTTPException(status_code=401, detail="SerpApi API key bulunamadı.")

        params = {
            "engine": "google_events",
            "q": keyword,
            "hl": "en",
            "gl": "tr",
            "api_key": serpapi_key,
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        events = results.get("events_results", [])

        return {"events": events}

