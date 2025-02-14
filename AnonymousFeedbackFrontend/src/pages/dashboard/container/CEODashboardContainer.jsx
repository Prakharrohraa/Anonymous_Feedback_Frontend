import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import CEODashboardComponent from "../component/CEODashboardComponent";

export default function CEODashboardContainer() {
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [subordinateReviews, setSubordinateReviews] = useState([]);
  const [showApproved, setShowApproved] = useState(false);
  const [showSubordinate, setShowSubordinate] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [expandedFeedbackId, setExpandedFeedbackId] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const ceoId = Cookies.get("userID");
  const token = Cookies.get("authToken");

  // Fetch approved reviews
  useEffect(() => {
    if (showApproved) {
      axios
        .get("http://localhost:8080/api/company/approved-reviews", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setApprovedReviews(res.data))
        .catch((err) => console.error("Error fetching approved reviews:", err));
    }
  }, [showApproved, token]);

  // Fetch subordinate reviews
  useEffect(() => {
    if (showSubordinate) {
      axios
        .get(`http://localhost:8080/api/manager/${ceoId}/subordinates/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setSubordinateReviews(res.data))
        .catch((err) => console.error("Error fetching subordinate reviews:", err));
    }
  }, [showSubordinate, ceoId, token]);

  // Fetch users for feedback modal
  useEffect(() => {
    if (showFeedbackModal) {
      const data = axios
        .get("http://localhost:8080/api/user/getall", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Error fetching users:", err));
        console.log(data);
        
    }
  }, [showFeedbackModal, token]);

  // Handle search for users
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setReceiverEmail(query);
    setFilteredUsers(users.filter((user) => user.email.toLowerCase().includes(query)));
    setShowDropdown(query.length >= 1);
  };

  // Handle user selection from dropdown
  const handleUserSelect = (email) => {
    setReceiverEmail(email);
    setSearchQuery(email);
    setShowDropdown(false);
  };

  // Handle sending feedback
  const handleSendFeedback = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/feedback/create",
        { receiverEmail, message: feedbackMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowFeedbackModal(false);
      setReceiverEmail("");
      setFeedbackMessage("");
      setSearchQuery("");
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("userRole");
    navigate("/login");
  };

  return (
    <CEODashboardComponent
      approvedReviews={approvedReviews}
      subordinateReviews={subordinateReviews}
      showApproved={showApproved}
      showSubordinate={showSubordinate}
      showFeedbackModal={showFeedbackModal}
      searchQuery={searchQuery}
      filteredUsers={filteredUsers}
      showDropdown={showDropdown}
      expandedFeedbackId={expandedFeedbackId}
      feedbackMessage={feedbackMessage}
      onToggleApproved={() => setShowApproved(!showApproved)}
      onToggleSubordinate={() => setShowSubordinate(!showSubordinate)}
      onToggleFeedbackModal={() => setShowFeedbackModal(!showFeedbackModal)}
      onSearchChange={handleSearchChange}
      onUserSelect={handleUserSelect}
      onSendFeedback={handleSendFeedback}
      onLogout={handleLogout}
      onNavigateToSettings={() => navigate("/settings")}
      onToggleFeedback={(id) => setExpandedFeedbackId(expandedFeedbackId === id ? null : id)}
      onFeedbackMessageChange={(e) => setFeedbackMessage(e.target.value)}
    />
  );
}