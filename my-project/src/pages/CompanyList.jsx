import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

export default function EventbriteEvents() {
  const [keyword, setKeyword] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const handleFetchEvents = async (e) => {
  e.preventDefault(); // <--- burası şart
  try {
    const response = await axios.post(
      "http://localhost:8000/eventbrite/events-search",
      { keyword },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("🎯 Gelen Eventler:", response.data.events);
    setEvents(response.data.events || []);
    setError(null);
  } catch (err) {
    console.error("Hata:", err);
    setError(err.response?.data?.detail || err.message || "Bir hata oluştu.");
  }
};


  return (
      <>
          <Navbar/>

      <div className="bg-gradient-to-br from-white to-purple-500 p-4">

          <h2 className="text-2xl font-bold mb-4">Etkinlik Ara</h2>

          <input
              type="text"
              placeholder="Konu girin (örn: AI, Blockchain)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="border p-2 m-2"
          />
          <button
              type="button"  // <<< Form submiti engellemek için önemli
              onClick={handleFetchEvents}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
              Eventleri Getir
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="mt-6 grid gap-4">
              {events.length === 0 ? (
                  <p>Henüz etkinlik bulunamadı.</p>
              ) : (
                  events.map((event, index) => (
                      <div key={index} className="border p-4 rounded shadow-md bg-white">
                          <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                          <p><strong>Tarih:</strong> {event.date?.when || "Tarih bilgisi yok"}</p>
                          <p><strong>Açıklama:</strong> {event.description?.slice(0, 100) || "Açıklama yok"}...</p>
                          <a
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline mt-2 inline-block"
                          >
                              Etkinlik Linki
                          </a>
                      </div>
                  ))
              )}
          </div>
      </div>
             </>
  );
}
