import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaLock } from "react-icons/fa";

const techFields = [
  "Yapay Zeka",
  "Siber Güvenlik",
  "Web Geliştirme",
  "Mobil Uygulama",
  "Veri Bilimi",
  "Blockchain",
  "IoT",
  "Oyun Geliştirme",
  "Diğer"
];

export default function Register() {
  const [selectedFields, setSelectedFields] = useState([]);
  const [otherField, setOtherField] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    company: "",
    website: "",
    description: ""
  });

  const navigate = useNavigate();

  const handleCheckboxChange = (field) => {
    if (field === "Diğer") {
      setSelectedFields((prev) =>
        prev.includes("Diğer") ? prev.filter(f => f !== "Diğer") : [...prev, "Diğer"]
      );
      if (!selectedFields.includes("Diğer")) setOtherField("");
    } else {
      setSelectedFields((prev) =>
        prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allFields = selectedFields.includes("Diğer")
      ? [...selectedFields.filter(f => f !== "Diğer"), otherField]
      : selectedFields;

    const payload = {
      ...formData,
      sector: "Teknoloji",
      subfields: allFields
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/register", payload);
      console.log("Kayıt başarılı:", res.data);
      alert("✅ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      navigate("/login");
    } catch (err) {
      console.error("Kayıt başarısız:", err);
      alert("❌ Kayıt başarısız. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 relative overflow-hidden">


      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl animate-slideUp">
        <div className="flex flex-col items-center mb-6">
        <FaLock size={40} className="text-white mb-2" />
          <h2 className="text-2xl font-semibold text-white">Kayıt Ol</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 "
          />
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 "
          />
          <input
            type="text"
            name="company"
            placeholder="Şirket Adı"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 "
          />
          <input
            type="text"
            name="website"
            placeholder="Website (opsiyonel)"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 "
          />
          <textarea
            name="description"
            placeholder="Şirket hakkında kısa açıklama (opsiyonel)"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 "
          />

          <div className="text-white text-sm">
            <p className="mb-2 font-semibold">Teknoloji Alt Alanları</p>
            <div className="grid grid-cols-2 gap-2">
              {techFields.map((field) => (
                <label key={field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field)}
                    onChange={() => handleCheckboxChange(field)}
                    className="accent-indigo-400"
                  />
                  {field}
                </label>
              ))}
            </div>

            {selectedFields.includes("Diğer") && (
              <input
                type="text"
                placeholder="Belirtin..."
                value={otherField}
                onChange={(e) => setOtherField(e.target.value)}
                className="w-full mt-3 px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:scale-105"
          >
            Kayıt Ol
          </button>
        </form>

        <p className="text-center text-white text-sm mt-6">
          Zaten hesabın var mı?{" "}
          <Link to="/login" className="underline hover:text-gray-300">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
