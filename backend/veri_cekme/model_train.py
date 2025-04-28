from prophet import Prophet
import pandas as pd
import json
import os

# Veriyi oku
df = pd.read_csv("tech_fields_trends.csv")
df["date"] = pd.to_datetime(df["date"])

# Forecastları burada toplayacağız
all_forecasts = {}

# Hangi kolonlara forecast yapacağız
fields = [
    "Artificial Intelligence", "Cyber Security", "Web Development",
    "Mobile Application", "Data Science", "Blockchain", "Internet of Things",
    "Game Development", "Emerging Technologies"
]

# Her alan için Prophet modeli kur
for field in fields:
    print(f"Forecast yapılıyor: {field}")
    df_field = df[["date", field]].rename(columns={"date": "ds", field: "y"})

    model = Prophet()
    model.fit(df_field)

    # 30 günlük forecast için:
    future = model.make_future_dataframe(periods=720, freq='H')
    forecast = model.predict(future)

    # Sadece tarih ve tahmin kolonlarını al
    forecast_simple = forecast[["ds", "yhat"]]

    # Dictionary olarak kaydet
    all_forecasts[field] = forecast_simple.to_dict(orient="records")

# JSON dosyasına kaydet
with open("../api/all_forecasts.json", "w", encoding="utf-8") as f:
    json.dump(all_forecasts, f, ensure_ascii=False, indent=2, default=str)

print("✅ Tüm forecastlar all_forecasts.json dosyasına kaydedildi.")
