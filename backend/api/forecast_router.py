from fastapi import APIRouter
import json
import os
import pathlib
router = APIRouter()

BASE_DIR = pathlib.Path(__file__).resolve().parent
json_path = BASE_DIR / "all_forecasts.json"
@router.get("/forecast")
async def get_forecast():
    try:
        # JSON dosyasının yolu

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        return {"status": "success", "forecast": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
