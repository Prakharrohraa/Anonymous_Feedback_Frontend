import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get("authToken");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, [token]);

  const handleLogout = () => {
    Cookies.remove("authToken");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Profile</h1>
        <div className="space-x-4">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate(-1)}>Back</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
          {user ? (
            <>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">Role: {user.role}</p>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>
    </div>
  );
}
