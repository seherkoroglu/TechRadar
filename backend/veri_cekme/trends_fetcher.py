from pytrends.request import TrendReq
import pandas as pd
import os

techFields = [
    "Artificial Intelligence",
    "Cyber Security",
    "Web Development",
    "Mobile App",
    "Data Science",
    "Blockchain",
    "IoT",
    "Game Development"
]

pytrends = TrendReq(hl='en-US', tz=360)

def chunks(lst, n):
    """n elemanlık gruplar oluşturur."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def fetch_trends():
    try:
        all_data = pd.DataFrame()

        for group in chunks(techFields, 5):  # 5'erli gönderiyoruz
            pytrends.build_payload(group, timeframe='now 7-d')
            df = pytrends.interest_over_time()
            if not df.empty:
                all_data = pd.concat([all_data, df], axis=1)

        if all_data.empty:
            print("❌ Veri boş geldi!")
            return

        # Timestamp ekleyelim
        all_data["timestamp"] = pd.Timestamp.now()

        # CSV kaydet
        csv_path = "tech_fields_trends.csv"

        if not os.path.exists(csv_path):
            all_data.to_csv(csv_path, index=True)
            print("✅ İlk veri kaydedildi!")
        else:
            all_data.to_csv(csv_path, mode='a', header=False, index=True)
            print("✅ Yeni veri eklendi!")

    except Exception as e:
        print("❌ Hata oluştu:", str(e))

if __name__ == "__main__":
    fetch_trends()
