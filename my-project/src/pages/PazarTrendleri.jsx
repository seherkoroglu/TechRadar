import { useState } from "react";
import Navbar from "../components/Navbar.jsx";

export default function PazarTrendleri() {
  const [riskyTrends, setRiskyTrends] = useState([]);
  const [safeTrends, setSafeTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  const riskWords = ["crash", "scandal", "regulation", "risk", "layoff", "downturn", "loss", "hack", "fraud", "collapse"];

  const fetchTrends = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/ai/ai/trend-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subfields: ["Artificial Intelligence", "FinTech", "Cyber Security"] }),
      });
      const data = await res.json();

      if (data.status === "success") {
        const matchedTitles = data.trends.flatMap(([label]) => label.toLowerCase());

        const risky = [];
        const safe = [];

        for (const title of matchedTitles) {
          if (riskWords.some(word => title.includes(word))) {
            risky.push(title);
          } else {
            safe.push(title);
          }
        }

        setRiskyTrends(risky);
        setSafeTrends(safe);
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
         <Navbar/>

    <div className="bg-gradient-to-br from-white to-purple-500 mx-auto p-6 space-y-10">

      <h1 className="text-3xl font-bold text-center text-indigo-700">📊 Pazar Risk Haritası</h1>

      <div className="text-center">
        <button
          onClick={fetchTrends}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition mt-6"
        >
          {loading ? "Yükleniyor..." : "Risk Haritasını Getir 🚀"}
        </button>
      </div>

      {(riskyTrends.length > 0 || safeTrends.length > 0) && (
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold text-red-600 mb-4 text-center">⚠️ Riskli Alanlar</h2>
            <ul className="list-disc pl-6 space-y-2">
              {riskyTrends.map((title, index) => (
                <li key={index} className="text-red-600">{title}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold text-green-600 mb-4 text-center">✅ Güvenli Alanlar</h2>
            <ul className="list-disc pl-6 space-y-2">
              {safeTrends.map((title, index) => (
                <li key={index} className="text-green-600">{title}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
        </>
  );
}
