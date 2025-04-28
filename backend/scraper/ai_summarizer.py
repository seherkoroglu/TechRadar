import os
from dotenv import load_dotenv
import openai
from pymongo import MongoClient

# .env dosyasını yükle
load_dotenv()

# OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

# MongoDB bağlantısı
client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB_NAME")]
articles = db["articles"]


def summarize_and_tag(article):
    prompt = f"""
    Aşağıdaki Medium makalesiyle ilgili 2 cümlelik bir özet ve 3 anahtar etiket üret.

    Başlık: {article['title']}
    Açıklama: {article['summary']}

    Cevabı şu formatta ver:
    {{
        "summary": "...",
        "tags": ["...", "...", "..."]
    }}
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    try:
        # JSON dönüş bekleniyor
        return eval(response["choices"][0]["message"]["content"])
    except:
        print("[!] Yanıt JSON formatında değil!")
        return {"summary": article['summary'], "tags": []}


def enrich_articles():
    cursor = articles.find({"summary": {"$ne": ""}, "tags": []})

    for article in cursor:
        try:
            result = summarize_and_tag(article)
            articles.update_one(
                {"_id": article["_id"]},
                {"$set": {
                    "summary": result["summary"],
                    "tags": result["tags"]
                }}
            )
            print(f"[✓] Güncellendi: {article['title']}")
        except Exception as e:
            print(f"[!] Hata: {e}")


if __name__ == "__main__":
    enrich_articles()
