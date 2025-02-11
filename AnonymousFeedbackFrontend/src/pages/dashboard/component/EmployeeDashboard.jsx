import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/SettingsPage.css";
// Import the CSS file

export default function EmployeeDashboard() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("authToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/getall", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (showFeedbackModal) {
      fetchUsers();
    }
  }, [showFeedbackModal, token]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setReceiverEmail(query);

    if (query.length >= 1) {
      const filtered = users.filter((user) =>
        user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
      setShowDropdown(true);
    } else {
      setFilteredUsers([]);
      setShowDropdown(false);
    }
  };

  const handleUserSelect = (email) => {
    setReceiverEmail(email);
    setSearchQuery(email);
    setShowDropdown(false);
  };

  const handleSendFeedback = async () => {
    try {
      const feedbackData = {
        receiverEmail,
        message: feedbackMessage,
      };

      const response = await axios.post("http://localhost:8080/api/feedback/create", feedbackData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      alert(response.data);
      setShowFeedbackModal(false);
      setReceiverEmail("");
      setFeedbackMessage("");
      setSearchQuery("");
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("userRole");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Anonymous Feedback</h1>
        <div className="space-x-4">
          <button className="px-4 py-2 bg-gray-700 rounded" onClick={() => navigate("/settings")}>Settings</button>
          <button className="px-4 py-2 bg-red-600 rounded" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Employee Dashboard</h2>
          <button className="flex-1 py-2 bg-blue-600 rounded mb-2 button-height" onClick={() => setShowFeedbackModal(true)}>
            Send Feedback
          </button>
        </div>

        {/* Content Section with Background Image */}
        <div className="flex-1 p-4 rounded-lg shadow-md overflow-auto right-content-background">
          <h2 className="text-2xl font-bold mb-4 text-white">Welcome to Your Dashboard</h2>
          <p className="text-gray-500">Use the sidebar to navigate through different sections.</p>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Send Feedback</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search user by email..."
                className="w-full p-2 border mb-2"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
              />
              {showDropdown && filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto ">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.email}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => handleUserSelect(user.email)}
                    >
                      {user.email}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <textarea
              placeholder="Enter Feedback"
              className="w-full p-2 border mb-2"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded "
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSearchQuery("");
                  setReceiverEmail("");
                }}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSendFeedback}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
