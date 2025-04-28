import pandas as pd

# 🔥 1. Dosyayı oku, doğru kolonları al
df = pd.read_csv("tech_fields_trends.csv", usecols=[
    "date",
    "Artificial Intelligence",
    "Cyber Security",
    "Web Development",
    "Mobile Application",
    "Data Science",
    "Blockchain",
    "Internet of Things",
    "Game Development",
    "Emerging Technologies"
])

# 🔥 2. Tarih kolonu datetime olsun
df["date"] = pd.to_datetime(df["date"], errors="coerce")

# 🔥 3. Sayısal kolonları integer'a çevir
numeric_cols = [
    "Artificial Intelligence",
    "Cyber Security",
    "Web Development",
    "Mobile Application",
    "Data Science",
    "Blockchain",
    "Internet of Things",
    "Game Development",
    "Emerging Technologies"
]
for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# 🔥 4. Null veri varsa at
df = df.dropna()

# 🔥 5. Temiz CSV kaydet
df.to_csv("tech_fields_trends_cleaned.csv", index=False)

print("✅ Temiz veri başarıyla oluşturuldu!")
