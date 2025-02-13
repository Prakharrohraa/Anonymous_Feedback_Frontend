import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import HRDashboardComponent from "../component/HRDashboardComponent";

const HRDashboardContainer = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [subordinateReviews, setSubordinateReviews] = useState([]);
  const [showPending, setShowPending] = useState(false);
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);
  const [showSubordinate, setShowSubordinate] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get("authToken");

  useEffect(() => {
    if (showPending) {
      axios
        .get("http://localhost:8080/api/hr/pending-reviews", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPendingReviews(res.data))
        .catch((err) => console.error("Error fetching pending reviews:", err));
    }
  }, [showPending, token]);

  useEffect(() => {
    if (showAllFeedbacks) {
      axios
        .get("http://localhost:8080/api/feedback/all", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAllFeedbacks(res.data))
        .catch((err) => console.error("Error fetching all feedbacks:", err));
    }
  }, [showAllFeedbacks, token]);

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

  const handleApproveReview = (reviewId) => {
    axios
      .put(
        `http://localhost:8080/api/hr/approve/${reviewId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => setPendingReviews(pendingReviews.filter((review) => review.id !== reviewId)))
      .catch((err) => console.error("Error approving review:", err));
  };

  const handleSendFeedback = async () => {
    try {
      const feedbackData = { receiverEmail, message: feedbackMessage };
      await axios.post("http://localhost:8080/api/feedback/create", feedbackData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      setShowFeedbackModal(false);
      setReceiverEmail("");
      setFeedbackMessage("");
      setSearchQuery("");
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  const toggleFeedback = (feedbackId) => {
    setExpandedFeedbackId(expandedFeedbackId === feedbackId ? null : feedbackId);
  };

  return (
    <HRDashboardComponent
      showPending={showPending}
      setShowPending={setShowPending}
      pendingReviews={pendingReviews}
      handleApproveReview={handleApproveReview}
      showAllFeedbacks={showAllFeedbacks}
      setShowAllFeedbacks={setShowAllFeedbacks}
      allFeedbacks={allFeedbacks}
      expandedFeedbackId={expandedFeedbackId}
      toggleFeedback={toggleFeedback}
      showSubordinate={showSubordinate}
      setShowSubordinate={setShowSubordinate}
      subordinateReviews={subordinateReviews}
      showFeedbackModal={showFeedbackModal}
      setShowFeedbackModal={setShowFeedbackModal}
      searchQuery={searchQuery}
      handleSearchChange={handleSearchChange}
      showDropdown={showDropdown}
      filteredUsers={filteredUsers}
      handleUserSelect={handleUserSelect}
      feedbackMessage={feedbackMessage}
      setFeedbackMessage={setFeedbackMessage}
      handleSendFeedback={handleSendFeedback}
      navigate={navigate}
    />
  );
};

export default HRDashboardContainer;
