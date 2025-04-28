import openai
from fastapi import APIRouter, HTTPException, Request
from dotenv import load_dotenv
from typing import List, Optional
from openai import OpenAI
import os
from fastapi import APIRouter, Depends
import pandas as pd
import joblib
from pydantic import BaseModel
from typing import List
from serpapi import GoogleSearch
from sklearn.feature_extraction.text import CountVectorizer
import numpy as np
import requests

router = APIRouter()  # ✅ BURASI ŞART

# .env dosyasını yükle
load_dotenv()


serpapi_key = os.getenv("SERPAPI_KEY")

# ✅ OpenAI client oluştur
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ✅ Yeni kayıt bilgilerimizi destekleyecek model
class AIRequest(BaseModel):
    company: str
    website: Optional[str] = None
    description: Optional[str] = None
    sector: str
    subfields: List[str]


import os

BASE_DIR = os.path.dirname(os.path.realpath(__file__))  # scraper/ klasörünün tam yolu

MODEL_PATH = os.path.join(BASE_DIR, "techcrunch_full_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "techcrunch_full_vectorizer.pkl")
NEWS_PATH = os.path.join(BASE_DIR, "techcrunch_full_news.csv")

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)
full_news_df = pd.read_csv(NEWS_PATH)

class TrendRequest(BaseModel):
    subfields: List[str]

@router.post("/suggestions")
def get_suggestions(data: AIRequest):
    company = data.company
    sector = data.sector
    website = data.website or "Bilinmiyor"
    description = data.description or ""
    subfields = ", ".join(data.subfields)

    prompt = (
        f"{company} adlı şirket, {sector} sektöründe faaliyet göstermektedir. Web sitesi: {website}. "
        f"Alt alanlar: {subfields}. Açıklama: {description}. "
        f"Bu şirkete özel büyüme stratejileri, inovasyon önerileri ve rekabet avantajı yaratacak kısa ve öz bilgiler sun."
        f" Rakip şirketleri göster ve onlar neler yapıyor ayrıntılı bahset."
    )

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Sen strateji danışmanı bir AI'sın."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=900,
            temperature=0.9,
        )

        ai_response = completion.choices[0].message.content.strip()
        return {"suggestions": ai_response}

    except Exception as e:
        import traceback
        print("❌ AI HATASI:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="AI hatası: " + str(e))


@router.post("/forecast-advice")
async def get_forecast_advice(trend_comments: dict):
    try:
        comments = trend_comments.get("comments", [])
        if not comments:
            raise HTTPException(status_code=400, detail="Yorumlar boş.")

        trends_text = "\n".join([f"- {comment}" for comment in comments])

        prompt = f"""Aşağıdaki teknoloji trend analizlerine dayanarak teknoloji sektöründe çalışan bir girişimci için 3-4 cümlelik profesyonel tavsiyeler hazırla:
{trends_text}

- Hangi alanlara yatırım yapılmalı?
- Hangi alanlarda dikkatli olunmalı?
- Potansiyel fırsatlar nerede olabilir?

Cevabın kısa, net ve stratejik olsun."""

        # OpenAI 1.0.0 standardında Chat oluşturma
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "Sen deneyimli bir teknoloji danışmanısın."},
                {"role": "user", "content": prompt}
            ],
            temperature=1,
            max_tokens=700
        )

        advice = response.choices[0].message.content.strip()
        return {"status": "success", "advice": advice}

    except Exception as e:
        print(f"🔥 OpenAI API Hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI hatası: {str(e)}")


class Company(BaseModel):
    name: str
    description: str
    employees: str

class SectorRequest(BaseModel):
    sector: str
    companies: List[Company]


@router.post("/sector-analysis")
async def sector_analysis(request: SectorRequest):
    try:
        # Şirket açıklamalarını birleştir
        combined_text = "\n".join([f"{c.name}: {c.description}" for c in request.companies])

        # İyileştirilmiş prompt
        prompt = f"""
{request.sector} sektöründe faaliyet gösteren şirketlerin açıklamaları şunlardır:\n{combined_text}\n
Bu açıklamalara bakarak aşağıdaki formatta çok kısa ve sade bir sektörel analiz yaz:
- En fazla 5 madde olacak.
- Her madde 20 kelimeyi aşmayacak.
- Madde madde yaz, başlıklar kısa olsun.
- Uzun açıklamalar yapma, sadece konu özeti çıkar.
- Başlıkların altına 2-3 madde yaz.
- Başında ve sonunda genel giriş-kapanış cümlesi olmasın.
- Sadece temiz, okunabilir maddeler üret.
"""

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Sen sektörel veri analisti bir asistansın."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )

        result = response.choices[0].message.content.strip()

        return {"status": "success", "analysis": result}

    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.post("/ai/trend-prediction")
async def predict_trends(request: TrendRequest):
    try:
        subfield_keywords = [s.lower() for s in request.subfields]
        matched_news = []

        for _, row in full_news_df.iterrows():
            title = str(row["title"]).lower()
            if any(keyword in title for keyword in subfield_keywords):
                matched_news.append(title)

        if not matched_news:
            return {"status": "success", "trends": [], "message": "Eşleşen haber bulunamadı."}

        # Kategori tahmini yap
        X_vec = vectorizer.transform(matched_news)
        predictions = model.predict(X_vec)

        # Trendleri say
        trend_summary = {}
        for pred in predictions:
            trend_summary[pred] = trend_summary.get(pred, 0) + 1

        sorted_trends = sorted(
            ((str(k), int(v)) for k, v in trend_summary.items()),
            key=lambda x: x[1],
            reverse=True
        )

        # 2-3 kelimelik phrase extraction
        count_vect = CountVectorizer(ngram_range=(2, 3), stop_words='english')
        X_phrases = count_vect.fit_transform(matched_news)
        phrases = count_vect.get_feature_names_out()

        # Phrase frekansları
        phrase_freq = X_phrases.sum(axis=0).A1
        phrase_freq_dict = dict(zip(phrases, phrase_freq))

        sorted_phrases = sorted(
            ((str(phrase), int(freq)) for phrase, freq in phrase_freq_dict.items()),
            key=lambda x: x[1],
            reverse=True
        )[:50]

        return {
            "status": "success",
            "trends": sorted_trends,
            "phrases": sorted_phrases
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/ai/trend-keywords")
async def trend_keywords(request: TrendRequest):
    try:
        subfield_keywords = [s.lower() for s in request.subfields]

        matched_titles = []
        for _, row in full_news_df.iterrows():
            title = str(row["title"]).lower()
            if any(keyword in title for keyword in subfield_keywords):
                matched_titles.append(title)

        if not matched_titles:
            return {"status": "success", "keywords": [], "message": "Eşleşen haber bulunamadı."}

        vectorizer = CountVectorizer(ngram_range=(2, 3), stop_words="english", max_features=100)
        X = vectorizer.fit_transform(matched_titles)
        keywords = vectorizer.get_feature_names_out()
        freqs = np.asarray(X.sum(axis=0)).flatten()

        keyword_freq_pairs = sorted(
            [(str(word), int(freq)) for word, freq in zip(keywords, freqs)],
            key=lambda x: x[1],
            reverse=True
        )

        return {"status": "success", "keywords": keyword_freq_pairs[:30]}

    except Exception as e:
        return {"status": "error", "message": str(e)}


class SubfieldRequest(BaseModel):
    subfield: str

@router.post("/ai/product-ideas")
async def generate_product_ideas(data: SubfieldRequest):
    subfield = data.subfield

    if not subfield:
        raise HTTPException(status_code=400, detail="Subfield bilgisi gerekli.")

    try:
        # 1. SerpApi ile subfield'a uygun şirket araması yapalım
        search = GoogleSearch({
            "engine": "google",
            "q": f"{subfield} startups 2025",
            "api_key": serpapi_key,
            "num": 5
        })
        results = search.get_dict()

        companies = []
        for result in results.get("organic_results", []):
            title = result.get("title")
            snippet = result.get("snippet")
            if title and snippet:
                companies.append(f"{title}: {snippet}")

        if not companies:
            raise HTTPException(status_code=404, detail="Şirket bulunamadı.")

        # 2. OpenAI ile ürün fikirleri ürettirelim
        companies_text = "\n".join(companies)

        prompt = (
            f"Kullanıcının sektörü: {subfield}.\n"
            f"Aşağıdaki şirketler bu sektörde faaliyet göstermektedir:\n"
            f"{companies_text}\n\n"
            "Bu örneklerden ilham alarak 5 yeni yaratıcı ürün fikri üret.\n"
            "Her bir fikri kısa ve özgün birer cümle olarak numaralandır."
        )
        print("📋 Prompt:", prompt)

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Sen yaratıcı bir ürün geliştirme danışmanısın."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800,
        )

        ai_response = completion.choices[0].message.content.strip()
        print("🧠 OpenAI cevabı:", ai_response)
        return {
            "companies": companies,
            "ideas": ai_response
        }

    except Exception as e:
        import traceback
        print("❌ Hata:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ai/trend-news")
def get_trend_news():
    API_KEY = "1b9cdfb7e9c34316847e7e085dabd303"  # 🔥
    url = f"https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey={API_KEY}"

    response = requests.get(url)
    if response.status_code != 200:
        return {"news": []}  # hata olursa boş dönelim

    news_data = response.json()

    articles = news_data.get("articles", [])[:10]  # İlk 10 haberi al
    result = [
        {
            "title": article.get("title", "Başlıksız"),
            "url": article.get("url", "#"),
            "publishedAt": article.get("publishedAt", "Bilinmiyor")
        }
        for article in articles
    ]
    return {"news": result}