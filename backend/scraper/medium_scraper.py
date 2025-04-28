import feedparser
from datetime import datetime
from urllib.parse import quote
from backend.database.mongo import articles

# Türkçe subfield isimleri
subfields_mapping = {
    "yapay-zeka": "Yapay Zeka",
    "siber-guvenlik": "Siber Güvenlik",
    "web-gelistirme": "Web Geliştirme",
    "mobil-uygulama": "Mobil Uygulama",
    "veri-bilimi": "Veri Bilimi",
    "blockchain": "Blockchain",
    "iot": "IoT",
    "oyun-gelistirme": "Oyun Geliştirme",
}

def fetch_articles_for_all_subfields():
    articles.delete_many({})
    print("🗑️ Eski makaleler silindi.")

    total_inserted = 0

    for slug, display_name in subfields_mapping.items():
        encoded_slug = quote(slug)
        feed_url = f"https://medium.com/feed/tag/{encoded_slug}"
        print(f"🔵 {feed_url} çekiliyor...")

        feed = feedparser.parse(feed_url)
        if not feed.entries:
            print(f"🔴 {display_name} için içerik yok.")
            continue

        article_list = []
        for entry in feed.entries[:5]:
            doc = {
                "source": "Medium RSS",
                "title": entry.title,
                "url": entry.link,
                "summary": getattr(entry, "summary", ""),
                "content": "",
                "tags": [display_name],
                "date": datetime.now().strftime("%Y-%m-%d")
            }
            article_list.append(doc)

        if article_list:
            try:
                articles.insert_many(article_list)
                total_inserted += len(article_list)
                print(f"🟢 {display_name} için {len(article_list)} makale kaydedildi.")
            except Exception as e:
                print(f"❌ Mongo hatası: {str(e)}")

    print(f"✅ Toplam {total_inserted} makale kaydedildi.")
    return total_inserted


if __name__ == "__main__":
    fetch_articles_for_all_subfields()

