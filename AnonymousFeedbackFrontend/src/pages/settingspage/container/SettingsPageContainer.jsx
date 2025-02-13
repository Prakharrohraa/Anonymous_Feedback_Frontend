import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SettingsComponent from "../component/SettingsPageComponent";

export default function SettingsContainer() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  const userId = Cookies.get("userID");
  const type = Cookies.get("userRole");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setName(res.data.name);
      setEmail(res.data.email);
    })
    .catch((err) => console.error("Error fetching user data:", err));
  }, [userId, token]);

  const handleUpdateProfile = () => {
    axios.put(
      `http://localhost:8080/api/user/${userId}/update`,
      { name, password },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(() => alert("Profile updated successfully"))
    .catch((err) => console.error("Error updating profile:", err));
  };

  const handleBackToDashboard = () => {
    const routes = {
      ceo: "/dashboard/ceo",
      manager: "/dashboard/manager",
      employee: "/dashboard/employee",
      hr: "/dashboard/hr",
    };
    navigate(routes[type] || "/dashboard");
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("userRole");
    navigate("/login");
  };

  return (
    <SettingsComponent
      name={name}
      email={email}
      onBackToDashboard={handleBackToDashboard}
      onLogout={handleLogout}
      onNavigateToSecurity={() => navigate("/settings/security")}
    />
  );
}