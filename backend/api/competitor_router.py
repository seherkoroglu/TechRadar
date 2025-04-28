from fastapi import APIRouter, Query
import pandas as pd
import os

router = APIRouter()

# CSV dosyasının yolu
CSV_PATH = os.path.join(os.path.dirname(__file__), "startup_listesi_with_links.csv")

# CSV'yi oku
df = pd.read_csv(CSV_PATH)

@router.get("/competitors")
async def get_competitors(sector: str = Query(...)):
    try:
        matches = df[df["predicted_sector"] == sector]
        if matches.empty:
            return {"status": "success", "competitors": []}

        result = matches[["name", "description", "employees", "link"]].to_dict(orient="records")
        return {"status": "success", "competitors": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}
