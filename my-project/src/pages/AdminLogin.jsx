import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (email === "admin@techradar.com" && password === "admin123") {
      localStorage.setItem("admin_token", "true");
      navigate("/admin-dashboard");
    } else {
      setError("Hatalı giriş. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 relative">
      <div className="backdrop-blur-md bg-white/20 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-white/30">
        <h2 className="text-2xl font-bold text-center text-white mb-6">🔒 Admin Girişi</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:scale-105"
          >
            Giriş Yap
          </button>
        </form>

        {error && (
          <p className="text-center text-red-400 mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
