from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import pandas as pd
import time

# Selenium ayarları
options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(options=options)

# Çekilecek kategoriler
categories = [
    "https://techcrunch.com/category/startups/",
    "https://techcrunch.com/category/venture/",
    "https://techcrunch.com/tag/apple/",
    "https://techcrunch.com/category/security/",
    "https://techcrunch.com/category/artificial-intelligence/",
    "https://techcrunch.com/category/apps/"
]

# Sonuçları kaydedeceğimiz liste
news_data = []

# Her kategori için işlemi başlat
for category_url in categories:
    print(f"🔵 {category_url} içinde haber çekiliyor...")

    current_page = 1
    max_pages = 50  # 🔥 Her kategoride en fazla 50 sayfa gez

    while current_page <= max_pages:
        try:
            # Sayfaya git ve yüklenmesini bekle
            url = f"{category_url}page/{current_page}/"
            driver.set_page_load_timeout(30)  # 30 saniye içinde yüklenmezse hata
            driver.get(url)

            time.sleep(2)  # sayfa iyice yüklensin

            soup = BeautifulSoup(driver.page_source, "html.parser")
            news_blocks = soup.find_all("li", class_="wp-block-post")

            if not news_blocks:
                print(f"🚫 {url} içinde haber bulunamadı, kategori tamamlandı!")
                break

            for news in news_blocks:
                try:
                    title_tag = news.find("h3", class_="loop-card__title")
                    title = title_tag.get_text(strip=True) if title_tag else ""

                    link_tag = news.find("a", class_="loop-card__title-link")
                    link = link_tag["href"] if link_tag else ""

                    category_tag = news.find("a", class_="loop-card__cat")
                    category_name = category_tag.get_text(strip=True) if category_tag else ""

                    time_tag = news.find("time")
                    published_time = time_tag.get_text(strip=True) if time_tag else ""

                    news_data.append({
                        "title": title,
                        "link": link,
                        "category": category_name,
                        "published_time": published_time,
                        "source_category": category_url.split("/")[-2]  # Hangi kategori URL'sinden geldi
                    })

                    print(f"✅ Haber çekildi: {title}")

                except Exception as e:
                    print(f"❗ Tekil haber işlenemedi: {e}")
                    continue

            current_page += 1

        except Exception as e:
            print(f"❗ {url} yüklenemedi veya hata oldu: {e}")
            break

print("\n🎯 Tüm kategorilerde scraping tamamlandı!")
driver.quit()

# Kaydet
df = pd.DataFrame(news_data)
df.to_csv("techcrunch_full_news.csv", index=False, encoding="utf-8-sig")
print(f"\n💾 Toplam {len(df)} haber kaydedildi: techcrunch_full_news.csv")
