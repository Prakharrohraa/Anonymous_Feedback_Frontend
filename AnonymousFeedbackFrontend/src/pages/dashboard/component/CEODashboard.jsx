import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/SettingsPage.css";

export default function CEODashboard() {
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

  useEffect(() => {
    if (showApproved) {
      axios
        .get("http://localhost:8080/api/company/approved-reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => setApprovedReviews(res.data))
        .catch((err) => console.error("Error fetching approved reviews:", err));
    }

    if (showSubordinate) {
      axios
        .get(`http://localhost:8080/api/manager/${ceoId}/subordinates/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setSubordinateReviews(res.data))
        .catch((err) => console.error("Error fetching subordinate reviews:", err));
    }
  }, [showApproved, showSubordinate, ceoId, token]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/getall", {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
        console.log("Fetched users:", response.data); // Debugging
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
      console.log("Filtered users:", filtered); // Debugging
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
    <div className="flex flex-col h-screen w-screen">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Anonymous Feedback</h1>
        <div className="space-x-4">
          <button className="px-4 py-2 bg-gray-700 rounded" onClick={() => navigate("/settings")}>
            Settings
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

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-4">CEO Dashboard</h2>
          <button
            className="flex-1 py-2 bg-gray-700 rounded mb-2 button-height"
            onClick={() => setShowApproved(!showApproved)}
          >
            {showApproved ? "Hide Company Reviews" : "Show Company Reviews"}
          </button>
          <button
            className="flex-1 py-2 bg-gray-700 rounded mb-2 button-height"
            onClick={() => setShowSubordinate(!showSubordinate)}
          >
            {showSubordinate ? "Hide Subordinate Reviews" : "Show Subordinate Reviews"}
          </button>
          <button
            className="flex-1 py-2 bg-blue-600 rounded mb-2 button-height"
            onClick={() => setShowFeedbackModal(true)}
          >
            Send Feedback
          </button>
        </div>

        {/* Right-Hand Side Content Section */}
        <div className="flex-1 p-4 rounded-lg shadow-md overflow-auto right-content-background">
          {showApproved && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Company Reviews</h2>
              {approvedReviews.length > 0 ? (
                <div className="space-y-4">
                  {approvedReviews.map((review) => (
                    <div
                      key={review.feedbackId}
                      className="bg-white p-4 rounded-lg shadow-sm"
                    >
                      <p className={`text-gray-800 ${expandedFeedbackId === review.feedbackId ? "" : "line-clamp-3"}`}>
                        {review.message}
                      </p>
                      {review.message.length > 100 && (
                        <button
                          onClick={() => toggleFeedback(review.feedbackId)}
                          className="text-blue-600 hover:text-blue-800 mt-2"
                        >
                          {expandedFeedbackId === review.feedbackId ? "Read less" : "Read more..."}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews available.</p>
              )}
            </div>
          )}

          {showSubordinate && (
            <div>
              <h2 className="text-2xl font-bold mt-6 mb-4 text-white">Subordinate Reviews</h2>
              {subordinateReviews.length > 0 ? (
                <div className="space-y-4">
                  {subordinateReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white p-4 rounded-lg shadow-sm"
                    >
                      <strong className="text-gray-700">{review.receiverName}:</strong>
                      <p className={`text-gray-600 mt-1 ${expandedFeedbackId === review.id ? "" : "line-clamp-3"}`}>
                        {review.message}
                      </p>
                      {review.message.length > 100 && (
                        <button
                          onClick={() => toggleFeedback(review.id)}
                          className="text-blue-600 hover:text-blue-800 mt-2"
                        >
                          {expandedFeedbackId === review.id ? "Read less" : "Read more..."}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white">No subordinate reviews available.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
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
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSearchQuery("");
                  setReceiverEmail("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSendFeedback}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}