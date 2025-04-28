import { Link } from "react-router-dom";

export default function NavbarMain() {
  return (
    <nav className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 px-6 py-4 shadow-sm flex items-center justify-between">
      {/* Sol tarafta logo */}
      <div>
        <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
          🚀 TechRadar
        </Link>
      </div>

      {/* Sağ tarafta butonlar */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-white text-sm hover:text-indigo-300 transition font-semibold"
        >
          Giriş Yap
        </Link>
        <Link
          to="/register"
          className="text-white text-sm hover:text-indigo-300 transition font-semibold"
        >
          Kayıt Ol
        </Link>
      </div>
    </nav>
  );
}
