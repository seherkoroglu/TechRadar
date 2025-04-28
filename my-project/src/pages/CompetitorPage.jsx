import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

export default function CompetitorPage() {
  const [sector, setSector] = useState("Artificial Intelligence");
  const [competitors, setCompetitors] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const sectors = [
    "Artificial Intelligence",
    "Blockchain",
    "Cyber Security",
    "HealthTech",
    "FinTech",
    "E-Commerce",
    "Software",
    "EdTech",
    "IoT",
    "Data Science",
    "Other"
  ];

  useEffect(() => {
    async function fetchCompetitors() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/api/competitors?sector=${encodeURIComponent(sector)}`);
        const data = await res.json();
        if (data.status === "success") {
          setCompetitors(data.competitors);
          setVisibleCount(5);
        }
      } catch (error) {
        console.error("Rakipler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitors();
  }, [sector]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const shortenText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  async function handleAnalyzeSector() {
    try {
      setLoadingAnalysis(true);
      const res = await fetch("http://localhost:8000/ai/sector-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector, companies: competitors }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error("Analiz alınamadı:", error);
    } finally {
      setLoadingAnalysis(false);
    }
  }

  const renderAnalysis = () => {
    const sections = analysis.split("####").map((part) => part.trim()).filter(Boolean);

    return (
      <div className="flex flex-col gap-6 mt-8">
        {sections.map((section, idx) => {
          const lines = section.split("\n").filter(Boolean);
          const title = lines[0];
          const content = lines.slice(1).join(" ");

          return (
            <div
              key={idx}
              className="bg-indigo-700 rounded-2xl shadow p-6 hover:shadow-lg transition-all"
            >
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">{title}</h3>
              <p
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(/rekabet/gi, '<span class="text-rose-500 font-semibold">rekabet</span>')
                    .replace(/boşluk/gi, '<span class="text-green-600 font-semibold">boşluk</span>')
                    .replace(/fırsat/gi, '<span class="text-blue-600 font-semibold">fırsat</span>')
                    .replace(/ihtiyaç/gi, '<span class="text-purple-600 font-semibold">ihtiyaç</span>')
                    .replace(/girişim/gi, '<span class="text-orange-500 font-semibold">girişim</span>')
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
      <>
       <Navbar/>
    <div className="bg-gradient-to-br from-white to-purple-500  mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6 text-center">Rakip Analizi</h1>

      <div className="mb-6 flex justify-center">
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="border p-2 rounded shadow"
        >
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Yükleniyor...</div>
      ) : (
        <>
          <div className="grid gap-6">
            {competitors.slice(0, visibleCount).map((company, index) => (
              <div key={index} className="border p-4 rounded shadow space-y-2">
                <h2 className="text-xl font-semibold">{company.name}</h2>
                <p className="text-gray-600">{company.employees}</p>
                <p className="text-gray-800">{shortenText(company.description)}</p>
                {company.name && (
                  <a
                    href={`https://wellfound.com/company/${company.name.toLowerCase().replace(/\s+/g, "-")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-indigo-600 hover:underline text-sm font-medium"
                  >
                    Şirketi İncele 🔗
                  </a>
                )}
              </div>
            ))}
          </div>

          {competitors.length > visibleCount && (
            <div className="text-center mt-6">
              <button
                onClick={handleShowMore}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Daha Fazla Göster
              </button>
            </div>
          )}
        </>
      )}

      <div className="text-center mt-8">
        <button
          onClick={handleAnalyzeSector}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          disabled={loadingAnalysis}
        >
          {loadingAnalysis ? "Analiz Yapılıyor..." : "Sektör Analizi Yap"}
        </button>
      </div>

      {analysis && (
  <div className="bg-gradient-to-br from-white to-purple-500 mt-8 p-6 bg-gray-100 rounded shadow space-y-6">
    <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
      {`Sektörel Rekabet Analizi: ${sector}`}
    </h2>
    <ul className="list-disc list-inside space-y-4 text-gray-800 text-lg">
      {analysis.split("\n").map((item, index) => (
        <li key={index}>{item.trim()}</li>
      ))}
    </ul>
  </div>
)}

    </div>
        </>
  );
}
