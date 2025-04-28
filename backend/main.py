from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.auth_router import router as auth_router
from scraper.articles_router import router as articles_router
from scraper.ai_router import router as ai_router
from scraper.eventbrite_router import router as eventbrite_router
from scraper.linkedin_router import router as linkedin_router
from api.forecast_router import router as forecast_router
from api.competitor_router import router as competitor_router
from scraper.admin_router import admin_router as admin_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend için
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🚀 BACKEND BAŞLADI")

app.include_router(auth_router, prefix="/auth")
app.include_router(ai_router, prefix="/ai")
app.include_router(articles_router, prefix="/articles")
app.include_router(eventbrite_router, prefix="/eventbrite")
app.include_router(linkedin_router, prefix="/linkedin", tags=["LinkedIn"])
app.include_router(forecast_router, prefix="/api")

app.include_router(competitor_router, prefix="/api")

app.include_router(admin_router, prefix="/api")


print("📌 Routerlar:", app.routes)
