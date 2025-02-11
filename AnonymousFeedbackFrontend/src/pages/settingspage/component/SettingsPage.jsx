import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/SettingsPage.css";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  const userId = Cookies.get("userID");
  const type = Cookies.get("userRole");

  useEffect(() => {
    console.log("userId:" + userId);

    axios
      .get(`http://localhost:8080/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, [userId, token]);

  const handleUpdateProfile = () => {
    axios
      .put(
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
    switch (type) {
      case "ceo":
        navigate("/dashboard/ceo");
        break;
      case "manager":
        navigate("/dashboard/manager");
        break;
      case "employee":
        navigate("/dashboard/employee");
        break;
      case "hr":
        navigate("/dashboard/hr");
        break;
      default:
        navigate("/dashboard"); // Fallback in case the role is not recognized
        break;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Settings</h1>
        <div className="space-x-4">
          <button
            className="px-4 py-2 bg-gray-700 rounded"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </button>
          <button
            className="px-4 py-2 bg-red-600 rounded"
            onClick={() => {
              Cookies.remove("authToken");
              Cookies.remove("userId");
              Cookies.remove("userRole");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <button className=" py-2 bg-gray-700 rounded mb-2">
            Profile
          </button>
          <button
            className=" py-2 bg-gray-700 rounded mb-2"
            onClick={() => navigate("/settings/security")} // Added navigation
          >
            Security
          </button>
          {/* <button className="flex-1 py-2 bg-gray-700 rounded mb-2">
            Notifications
          </button> */}
        </div>

        {/* Right-Hand Side Content Section with Background Image */}
        <div className="flex-1 p-4 rounded-lg shadow-md overflow-auto right-content-background">
          <h2 className="text-2xl font-bold mb-4 text-black">Profile Settings</h2>
          <div className="space-y-4">
            <div>   
              <label className="block text-xl font-bold text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="w-80 p-2 border rounded mt-1 text-center text-black text-lg"
                value={name}
                // onChange={(e) => setName(e.target.value)}
                disabled
              />
            </div>
            {/* <div>
              <label className="block text-xl font-bold text-gray-700">
                New Password
              </label>
              <input
                type="password"
                className="w-80 p-2 border rounded mt-1 text-center text-black text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div> */}
            <div>
              <label className="block text-xl font-bold text-gray-700">
                Email
              </label>
              <input
                type="text"
                className="w-80 p-2 border rounded mt-1 text-center text-black text-lg"
                value={email}
                disabled
              />
            </div>
            {/* <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleUpdateProfile}
            >
              Update Profile
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}