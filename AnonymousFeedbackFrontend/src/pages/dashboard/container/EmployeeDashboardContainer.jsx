import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../../../shared/navbar/Navbar";
import Sidebar from "../../../shared/sidebar/Sidebar";
import FeedbackModal from "../../../shared/components/feedbackmodal/FeedbackModal";
import { fetchAllUsers, createFeedback } from "../app";

const EmployeeDashboard = () => {
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
        const usersData = await fetchAllUsers(token);
        setUsers(usersData);
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
      await createFeedback(
        {
          receiverEmail,
          message: feedbackMessage,
        },
        token
      );
      alert("Feedback sent successfully!");
      setShowFeedbackModal(false);
      setReceiverEmail("");
      setFeedbackMessage("");
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
      <Navbar onLogout={handleLogout} />
      <div className="flex flex-grow">
        <Sidebar onFeedbackOpen={() => setShowFeedbackModal(true)} />
        {showFeedbackModal && (
          <FeedbackModal
            searchQuery={searchQuery}
            filteredUsers={filteredUsers}
            showDropdown={showDropdown}
            feedbackMessage={feedbackMessage}
            onSearchChange={handleSearchChange}
            onUserSelect={handleUserSelect}
            onFeedbackChange={(e) => setFeedbackMessage(e.target.value)}
            onCancel={() => {
              setShowFeedbackModal(false);
              setSearchQuery("");
              setReceiverEmail("");
            }}
            onSubmit={handleSendFeedback}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;