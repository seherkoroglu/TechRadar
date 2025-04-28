import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

export default function ProductIdeas() {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const fetchIdeas = async () => {
    if (!user?.subfield) {
      setError("Kullanıcının subfield bilgisi bulunamadı.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/ai/ai/product-ideas",
        { subfield: user.subfield },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompanies(response.data.companies || []);
      setIdeas(response.data.ideas || []);
    } catch (err) {
      console.error("Hata:", err);
      setError(err.response?.data?.detail || err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.subfield) {
      fetchIdeas();
    }
  }, [user]);

  return (
      <>
          <Navbar/>

    <div className="bg-gradient-to-br from-white to-purple-500 mx-auto p-6 space-y-12">

      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        🚀 Ürün Fikirleri ({user?.subfield})
      </h1>

      {loading && <p className="text-center text-gray-500">Yükleniyor...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && companies.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔍 Sektöründeki Örnek Şirketler</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {companies.map((company, index) => (
              <div key={index} className="p-6 bg-white rounded shadow hover:shadow-lg border-l-4 border-blue-500">
                <p className="text-lg font-semibold mb-2">{company}</p>
              </div>
            ))}
          </div>
        </div>
      )}

 {!loading && ideas && (
   <div>
     <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-10">💡 Üretilen Ürün Fikirleri</h2>
     <div className="p-6 bg-white rounded shadow hover:shadow-lg border-l-4 border-green-500">
       <pre className="whitespace-pre-wrap text-gray-700">{ideas}</pre>
     </div>
  </div>
 )}
    </div>
         </>
  );
}
