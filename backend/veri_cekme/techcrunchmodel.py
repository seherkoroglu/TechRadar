import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib

# 1. Veri Yükleme
print("📂 Veriler yukleniyor...")
df = pd.read_csv("../scraper/techcrunch_full_news.csv")

# 2. Temizlik
print("🧹 Temizlik yapılıyor...")
df = df.dropna(subset=["title", "category"])  # Başlık ve kategori boş olanları at
print(f"📚 Toplam haber sayısı: {len(df)}")

# 🛠️ Tek haberi olan kategorileri çıkar
category_counts = df["category"].value_counts()
valid_categories = category_counts[category_counts >= 2].index
df = df[df["category"].isin(valid_categories)]
print(f"✅ En az 2 haberi olan kategorilerle kalan haber sayısı: {len(df)}")

# 3. Özellik ve Etiketleri Belirleme
X = df["title"]
y = df["category"]

# 4. Eğitim / Test Ayrımı
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 5. TF-IDF Vektörizasyonu
vectorizer = TfidfVectorizer(max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# 6. Model Eğitimi
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

# 7. Değerlendirme
y_pred = model.predict(X_test_vec)
print(f"\n🎯 Accuracy: {accuracy_score(y_test, y_pred)}\n")
print("📋 Classification Report:\n", classification_report(y_test, y_pred))

# 8. Kaydet
joblib.dump(model, "../scraper/techcrunch_full_model.pkl")
joblib.dump(vectorizer, "../scraper/techcrunch_full_vectorizer.pkl")

print("\n✅ Model ve vectorizer kaydedildi!")
