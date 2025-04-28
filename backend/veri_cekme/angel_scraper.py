from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from bs4 import BeautifulSoup
import pandas as pd

# Açık Chrome sekmesine bağlan
options = webdriver.ChromeOptions()
options.debugger_address = "127.0.0.1:9222"
driver = webdriver.Chrome(options=options)

# Şirket verilerini toplayacağımız liste
companies = []

# Kaç sayfa gezilecek?
TOTAL_PAGES = 389

for page_num in range(1, TOTAL_PAGES + 1):
    print(f"🌎 {page_num}. sayfa yükleniyor...")

    # Sayfaya git
    url = f"https://wellfound.com/startups?page={page_num}"
    driver.get(url)
    time.sleep(5)  # Sayfanın yüklenmesini bekle

    # Sayfayı biraz kaydır (lazy load için)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2);")
    time.sleep(2)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(3)

    # Sayfa kaynağını al
    soup = BeautifulSoup(driver.page_source, "html.parser")

    # Şirket bloklarını bul
    company_blocks = soup.find_all("div", class_="styles_editorial__uDcY5")

    for block in company_blocks:
        try:
            name_tag = block.find("h2")
            name = name_tag.text.strip() if name_tag else "Bilinmiyor"

            desc_tag = block.find("span", class_="text-md text-neutral-1000")
            description = desc_tag.text.strip() if desc_tag else "Bilinmiyor"

            employee_tag = block.find("span", class_="text-xs italic text-neutral-500")
            employees = employee_tag.text.strip() if employee_tag else "Bilinmiyor"

            industries_tags = block.select("ul a[href*='/startups/industry/']")
            industries = [tag.text.strip() for tag in industries_tags] if industries_tags else []

            companies.append({
                "name": name,
                "description": description,
                "employees": employees,
                "industries": ", ".join(industries)  # Birden fazla sektör varsa virgülle birleştiriyoruz
            })
        except Exception as e:
            print("❗ Hata:", e)
            continue

    print(f"✅ Şu ana kadar {len(companies)} şirket kaydedildi.\n")

# Verileri kaydet
df = pd.DataFrame(companies)
df.to_csv("startup_listesi.csv", index=False, encoding="utf-8-sig")
print("🎯 Veri dosyaya kaydedildi: startup_listesi.csv")
