import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Büyüme Stratejileri");
  const [categorySuggestions, setCategorySuggestions] = useState({
    "Büyüme Stratejileri": [],
    "İnovasyon Önerileri": [],
    "Teknoloji Yatırımları": [],
  });
  const [news, setNews] = useState([]);

  const categoryIcons = {
    "Büyüme Stratejileri": "🚀",
    "İnovasyon Önerileri": "💡",
    "Teknoloji Yatırımları": "🤖",
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Kullanıcı alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchCategorySuggestions = async (category) => {
    try {
      const res = await fetch(`http://localhost:8000/ai/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: user.company,
          sector: user.sector,
          subfields: user.subfields,
          category: category,
        }),
      });
      const data = await res.json();
      return data.suggestions.split("\n").filter(line => line.trim());
    } catch (error) {
      console.error(`${category} önerileri alınamadı:`, error);
      return [];
    }
  };

  const fetchAllSuggestions = async () => {
    if (!user) return;

    const [growth, innovation, tech] = await Promise.all([
      fetchCategorySuggestions("growth"),
      fetchCategorySuggestions("innovation"),
      fetchCategorySuggestions("tech"),
    ]);

    setCategorySuggestions({
      "Büyüme Stratejileri": growth,
      "İnovasyon Önerileri": innovation,
      "Teknoloji Yatırımları": tech,
    });
  };

  const fetchNews = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/ai/ai/trend-news"); // 📰 haberler backend'den geliyor
      const data = await res.json();
      setNews(data.news || []);
    } catch (error) {
      console.error("Haberler alınamadı:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllSuggestions();
      fetchNews();
      const interval = setInterval(fetchNews, 60000); // her 60 saniyede bir haber güncelle
      return () => clearInterval(interval);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-purple-700">
        <p className="text-white text-lg animate-pulse">Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-purple-700">
        <p className="text-red-400 text-lg">Kullanıcı bilgisi yüklenemedi.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-purple-700 flex flex-col items-center p-6">

        {/* Şirket Bilgisi */}
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg mb-8 w-full max-w-3xl text-white text-center">
          <h2 className="text-2xl font-bold mb-2">👋 Hoş geldin, {user.email}!</h2>
          <p>🏢 Şirket: {user.company}</p>
          <p>🏷️ Sektör: {user.sector}</p>
          <p>🌐 Website: {user.website || "Belirtilmemiş"}</p>
        </div>

        {/* Kategori Butonları */}
        <h2 className="text-3xl font-bold text-white mb-6">🤖 AI Destekli Öneriler</h2>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {Object.keys(categoryIcons).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-white text-purple-700"
                  : "bg-purple-700 text-white hover:bg-purple-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {categorySuggestions[activeTab].length > 0 ? (
            categorySuggestions[activeTab].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/20 backdrop-blur-md p-6 rounded-lg text-white hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
              >
                <div className="text-2xl mb-2">{categoryIcons[activeTab]}</div>
                <p>{item}</p>
              </div>
            ))
          ) : (
            <p className="text-white">Bu kategori için öneri bulunamadı.</p>
          )}
        </div>

        {/* Yeni Öneriler Al Butonu */}
        <button
          onClick={fetchAllSuggestions}
          className="mt-10 bg-white text-purple-600 font-bold px-6 py-3 rounded-lg hover:bg-purple-200 transition-all"
        >
          🔄 Yeni Öneriler Al
        </button>

        {/* Trend Haberler */}
        <div className="mt-20 w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-6">📰 Trend Haberler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-md p-6 rounded-lg hover:scale-105 transition-all">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm mb-4">{new Date(item.publishedAt).toLocaleDateString()}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 underline hover:text-blue-400"
                >
                  Habere Git
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
