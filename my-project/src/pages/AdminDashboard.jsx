import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");

    if (!adminToken) {
      navigate("/login");
      return;
    }

    fetchUsers(adminToken);
  }, []);

  const fetchUsers = async (token) => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Kullanıcılar alınamadı:", err);
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğine emin misin?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      await axios.delete(`http://127.0.0.1:8000/api/admin/delete-user/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(token); // Güncelle
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("❌ Kullanıcı silinemedi!");
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser({
      email: user.email || "",
      company: user.company || "",
      sector: user.sector || "",
      subfields: user.subfields || [],
      website: user.website || "",
      description: user.description || "",
    });
  };

  const handleSaveDetails = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      await axios.put(`http://127.0.0.1:8000/api/admin/update-user/${selectedUser.email}`, {
        email: selectedUser.email,
        company: selectedUser.company,
        sector: selectedUser.sector,
        subfields: selectedUser.subfields,
        website: selectedUser.website,
        description: selectedUser.description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Kullanıcı bilgileri güncellendi!");
      setSelectedUser(null);
      fetchUsers(token); // Yeniden listele
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert("❌ Güncelleme başarısız.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-purple-700 flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold text-white mb-8">🎛️ Admin Panel</h1>

      <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-5xl text-white">
        <h2 className="text-2xl font-semibold mb-4">📋 Kayıtlı Kullanıcılar</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-white">
            <thead>
              <tr className="border-b border-white/30">
                <th className="p-2">E-posta</th>
                <th className="p-2">Şirket</th>
                <th className="p-2">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={idx} className="hover:bg-white/10">
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.company}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(u)}
                      className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs"
                    >
                      Detay
                    </button>
                    <button
                      onClick={() => handleDelete(u.email)}
                      className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300"
      >
        Çıkış Yap
      </button>

      {/* Detay Modalı */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">👤 Kullanıcı Detayı</h2>

            <div className="space-y-3">
              <input
                type="text"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="E-posta"
              />
              <input
                type="text"
                value={selectedUser.company}
                onChange={(e) => setSelectedUser({ ...selectedUser, company: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Şirket"
              />
              <input
                type="text"
                value={selectedUser.sector}
                onChange={(e) => setSelectedUser({ ...selectedUser, sector: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Sektör"
              />
              <input
                type="text"
                value={selectedUser.subfields.join(", ")}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    subfields: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="Alt Alanlar (virgülle ayır)"
              />
              <input
                type="text"
                value={selectedUser.website}
                onChange={(e) => setSelectedUser({ ...selectedUser, website: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Website"
              />
              <textarea
                value={selectedUser.description}
                onChange={(e) => setSelectedUser({ ...selectedUser, description: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Açıklama"
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Kapat
              </button>
              <button
                onClick={handleSaveDetails}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
