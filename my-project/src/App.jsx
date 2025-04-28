import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";         // ✅ Home ekledik
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Competitor from "./pages/CompetitorPage";
import CompanyList from "./pages/CompanyList";
import ArticlesPage from "./pages/ArticlesPage";
import Forecast from "./pages/Forecast";
import PazarTrendleri from "./pages/PazarTrendleri"; // ✅ doğru path
import ProductIdeas from "./pages/ProductIdeas.jsx";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">


        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} /> {/* ✅ Ana sayfayı Home yaptık */}
            <Route path="/login" element={<Login />} /> {/* Login ayrı path */}
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/company-list" element={<CompanyList />} />
<Route path="/competitors" element={<Competitor />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/forecast" element={<Forecast />} />
              <Route path="/pazar-trendleri" element={<PazarTrendleri />} />
              <Route path="/urun-fikirleri" element={<ProductIdeas />} />



<Route path="/admin-login" element={<AdminLogin />} />
<Route path="/admin-dashboard" element={<AdminDashboard />} />



          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
