from pytrends.request import TrendReq
import pandas as pd
import time
import random
import traceback

# Proxy kullanmıyoruz artık! (proxy ile uğraşmayacağız)
pytrends = TrendReq(hl='en-US', tz=360)

# Anahtar kelimeler
keywords_groups = [
    ["Artificial Intelligence", "Cyber Security", "Web Development", "Mobile Application", "Data Science"],
    ["Blockchain", "Internet of Things", "Game Development", "Emerging Technologies"]
]

all_dataframes = []

for group in keywords_groups:
    try:
        pytrends.build_payload(group, cat=0, timeframe='now 7-d', geo='', gprop='')

        df = pytrends.interest_over_time()

        if df.empty:
            print(f"❌ {group} grubunda veri bulunamadı.")
            continue

        # isPartial kolonunu siliyoruz
        if "isPartial" in df.columns:
            df = df.drop(columns=["isPartial"])

        all_dataframes.append(df)

        print(f"✅ {group} grubunun verisi alındı.")

        time.sleep(random.randint(2, 4))  # Google'ı yormamak için

    except Exception as e:
        print(f"❌ {group} grubunda hata oluştu:")
        traceback.print_exc()
        continue

# Tüm verileri birleştiriyoruz
if all_dataframes:
    final_df = pd.concat(all_dataframes, axis=1)

    # Aynı kolon adları olursa "_dup" eklemesin diye, tekrar edenleri kaldırıyoruz
    final_df = final_df.loc[:, ~final_df.columns.duplicated()]

    final_df.to_csv("tech_fields_trends.csv", index=True)
    print("✅ Veriler başarıyla kaydedildi: tech_fields_trends.csv")
else:
    print("❗ Hiç veri çekilemedi.")
