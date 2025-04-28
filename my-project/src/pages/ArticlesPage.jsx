import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";


export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Giriş yapılmamış.");
        setLoading(false);
        return;
      }

     const res = await axios.get("http://localhost:8000/articles/by-subfield", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


      console.log("📚 Gelen makaleler:", res.data);  // 🔥 BURAYI EKLEDİK

      if (Array.isArray(res.data)) {
        setArticles(res.data);
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error(err);
      setError("Makaleler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  fetchArticles();
}, []);


  if (loading) {
    return <div className="p-4 text-center">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
<>
    <Navbar/>

    <div className="bg-gradient-to-br from-white to-purple-500 p-6">

      <h2 className="text-2xl font-bold mb-4">İlgi Alanına Göre Makaleler</h2>

      {articles.length === 0 ? (
        <p>Hiç makale bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <div key={article._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{article.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{article.date}</p>
              <p className="mb-4">{article.summary}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Makaleyi Gör
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
