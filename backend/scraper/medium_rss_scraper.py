import feedparser
from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb+srv://seherkor2013:vG2JQzQnh8DiMt2m@techradar.eo6czzu.mongodb.net/?retryWrites=true&w=majority")
db = client["techradar"]
articles = db["articles"]

def scrape_medium_rss():
    feed = feedparser.parse("https://medium.com/feed/tag/artificial-intelligence")

    for entry in feed.entries[:5]:
        doc = {
            "source": "Medium RSS",
            "title": entry.title,
            "url": entry.link,
            "summary": entry.summary,
            "content": "",
            "tags": ["AI"],
            "date": datetime.now().strftime("%Y-%m-%d")
        }
        articles.insert_one(doc)
        print(f"[✓] RSS'den eklendi: {entry.title}")

if __name__ == "__main__":
    scrape_medium_rss()
