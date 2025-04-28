import { Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const menuStyle = "text-white hover:text-indigo-300 transition-all text-sm";

  const menuItems = [
    {
      title: "Analizler",
      links: [
{ to: "/competitors", label: "Rakip Analizi" },
        { to: "/forecast", label: "Tahminler" },
        { to: "/pazar-trendleri", label: "Pazar Trendleri" },
          { to: "/articles", label: "İlgi Alanı Makaleleri" },

      ],
    },
    {
      title: "Strateji",
      links: [
        { to: "/strateji-kutuphanesi", label: "Strateji Kütüphanesi" },
        { to: "/ai-swot", label: "AI SWOT Analizi" },
        { to: "/yetenek-haritasi", label: "Yetenek Haritası" },
      ],
    },
    {
      title: "Fikirler",
      links: [
        { to: "/urun-fikirleri", label: "Ürün Fikirleri" },
        { to: "/isbirligi-firsatlari", label: "İşbirliği Fırsatları" },
        { to: "/company-list", label: "Etkinlikler" },
      ],
    },
  ];

  return (
    <nav className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 px-6 py-4 shadow-sm flex items-center justify-between ">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-white text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🚀</span> TechRadar
        </Link>

        <Link to="/dashboard" className={menuStyle}>
          Anasayfa
        </Link>

        {menuItems.map((menu, index) => (
          <Menu as="div" className="relative" key={index}>
            <Menu.Button className={`${menuStyle} inline-flex items-center gap-1`}>
              {menu.title} <ChevronDown className="w-4 h-4" />
            </Menu.Button>
            <Menu.Items className="absolute z-50 mt-2 bg-white rounded shadow text-gray-800 w-52 p-2 space-y-1">
              {menu.links.map((link, i) => (
                <Menu.Item key={i}>
                  {({ active }) => (
                    <Link
                      to={link.to}
                      className={`block px-2 py-1 rounded ${active ? "bg-gray-100" : ""}`}
                    >
                      {link.label}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link to="/settings" className={menuStyle}>
          Ayarlar
        </Link>
        <Link to="/login" className={`${menuStyle} font-semibold`}>
          Çıkış
        </Link>
      </div>
    </nav>
 );
}