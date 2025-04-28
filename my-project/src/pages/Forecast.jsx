import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import Navbar from "../components/Navbar.jsx";


Chart.register(...registerables);

export default function Forecast() {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForecast() {
      try {
        const res = await fetch("http://localhost:8000/api/forecast");
        const data = await res.json();
        if (data.status === "success") {
          setForecastData(data.forecast);
        }
      } catch (error) {
        console.error("Tahmin verisi alınamadı:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, []);
  const [aiAdvice, setAiAdvice] = useState("");
const [generatingAdvice, setGeneratingAdvice] = useState(false);
const [trendComments, setTrendComments] = useState([]);


useEffect(() => {
  if (!forecastData) return;

  const trends = Object.keys(forecastData);
  const comments = [];

  trends.forEach((field) => {
    const trendData = forecastData[field];
    if (!trendData || trendData.length < 2) return;

    const first = trendData[0].yhat;
    const last = trendData[trendData.length - 1].yhat;

    const changePercent = ((last - first) / first) * 100;

    if (changePercent > 2) {
      comments.push(`${field} trendi artışta.`);
    } else if (changePercent < -2) {
      comments.push(`${field} trendi düşüşte.`);
    } else {
      comments.push(`${field} trendi sabit seyrediyor.`);
    }
  });

  setTrendComments(comments);

}, [forecastData]);

async function fetchAiAdvice() {
  try {
    setGeneratingAdvice(true);
    const res = await fetch("http://localhost:8000/ai/forecast-advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments: trendComments }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setAiAdvice(data.advice);
    }
  } catch (error) {
    console.error("AI önerisi alınamadı:", error);
  } finally {
    setGeneratingAdvice(false);
  }
}


  if (loading) {
    return <div className="text-center mt-10">Yükleniyor...</div>;
  }

  // ❗ Veri kontrolü yapıyoruz
  if (
    !forecastData ||
    !forecastData["Artificial Intelligence"] ||
    !Array.isArray(forecastData["Artificial Intelligence"])
  ) {
    return <div className="text-center mt-10">Veri bulunamadı.</div>;
  }

  const dates = forecastData["Artificial Intelligence"].map((item) => item.ds);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Yapay Zeka",
        data: forecastData["Artificial Intelligence"].map((item) => item.yhat),
        fill: false,
        borderColor: "rgba(99, 102, 241, 1)", // Indigo
        tension: 0.4,
      },
      {
        label: "Siber Güvenlik",
        data: forecastData["Cyber Security"]?.map((item) => item.yhat) || [],
        fill: false,
        borderColor: "rgba(16, 185, 129, 1)", // Green
        tension: 0.4,
      },
      {
        label: "Web Geliştirme",
        data: forecastData["Web Development"]?.map((item) => item.yhat) || [],
        fill: false,
        borderColor: "rgba(251, 191, 36, 1)", // Yellow
        tension: 0.4,
      },
      {
        label: "Mobil Uygulama",
        data: forecastData["Mobile Application"]?.map((item) => item.yhat) || [],
        fill: false,
        borderColor: "rgba(239, 68, 68, 1)", // Red
        tension: 0.4,
      },
      {
        label: "Veri Bilimi",
        data: forecastData["Data Science"]?.map((item) => item.yhat) || [],
        fill: false,
        borderColor: "rgba(34, 197, 94, 1)", // Light Green
        tension: 0.4,
      },
      {
        label: "Blockchain",
        data: forecastData["Blockchain"]?.map((item) => item.yhat) || [],
        fill: false,
        borderColor: "rgba(59, 130, 246, 1)", // Light Blue
        tension: 0.4,
      },
      {
        label: "IoT",
        data: forecastData["IoT"]?.map((item) => item.yhat) || [],
        fill: false,
        borderColor: "rgba(167, 139, 250, 1)", // Light Purple
        tension: 0.4,
      },
      {
        label: "Oyun Geliştirme",
        data: forecastData["Game Development"]?.map((item) => item.yhat) || [],
        fill: false,
        borderColor: "rgba(253, 224, 71, 1)", // Light Yellow
        tension: 0.4,
      },
      {
        label: "Yükselen Teknolojiler",
        data: forecastData["Emerging Technologies"]?.map((item) => item.yhat) || [],
        fill: false,
        borderColor: "rgba(236, 72, 153, 1)", // Pink
        tension: 0.4,
      },
    ],
  };

  return (
      <>
  <Navbar/>
      <div className="bg-gradient-to-br from-white to-purple-500  mx-auto px-4 py-10">

        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 font-space">
          Tüm Trend Alanları için 1 Aylık Tahminler
        </h1>
        <Line data={chartData}/>

        <div className="mt-10 text-center">
          <button
              onClick={fetchAiAdvice}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              disabled={generatingAdvice}
          >
            {generatingAdvice ? "Öneri Üretiliyor..." : "AI Destekli Öneri Al"}
          </button>

          {aiAdvice && (
              <div className="bg-gradient-to-br from-white to-purple-500 mt-8 max-w-3xl mx-auto p-6 bg-gray-100 rounded shadow">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">📚 Yapay Zeka Strateji Önerisi</h2>
                <p className="text-gray-700">{aiAdvice}</p>
              </div>
          )}
        </div>

      </div>
</>
  );
}
