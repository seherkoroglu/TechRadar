import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", { email, password });
      const { access_token, user } = res.data;

      if (!access_token || !user) {
        setError("Giriş bilgileri alınamadı.");
        return;
      }

      // Tokenı kaydet
      localStorage.setItem("token", access_token);

      if (user.is_admin) {
        localStorage.setItem("admin_token", access_token);
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Giriş başarısız:", err);
      setError("Giriş hatalı. Lütfen bilgileri kontrol et.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 relative overflow-hidden">
      <div className="backdrop-blur-md bg-white/20 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-white/30 animate-slideUp">
        <div className="flex justify-center mb-6">
          <FaLock size={40} className="text-white" />
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-6">Giriş Yap</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300" required />

          <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300" required />

          <button type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:scale-105">
            Giriş Yap
          </button>
        </form>

        <p className="text-center text-white mt-6 text-sm">
          Hesabın yok mu?{" "}
          <Link to="/register" className="underline hover:text-gray-300">
            Kayıt Ol
          </Link>
        </p>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-20"></div>
    </div>
  );
}
