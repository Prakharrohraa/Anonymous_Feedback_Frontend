import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FeedbackModal from "../components/FeedbackModal";
import { fetchAllUsers, createFeedback } from "../app";

const EmployeeDashboard = () => {
  const [state, setState] = useState({
    showFeedbackModal: false,
    receiverEmail: "",
    feedbackMessage: "",
    users: [],
    filteredUsers: [],
    searchQuery: "",
    showDropdown: false,
  });

  const navigate = useNavigate();
  const token = Cookies.get("authToken");

  useEffect(() => {
    const loadUsers = async () => {
      if (state.showFeedbackModal) {
        try {
          const usersData = await fetchAllUsers(token);
          setState((prev) => ({ ...prev, users: usersData }));
        } catch (error) {
          console.error("Error loading users:", error);
        }
      }
    };
    loadUsers();
  }, [state.showFeedbackModal, token]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = state.users.filter((user) =>
      user.email.toLowerCase().includes(query)
    );
    setState((prev) => ({
      ...prev,
      searchQuery: query,
      receiverEmail: query,
      filteredUsers: query.length >= 1 ? filtered : [],
      showDropdown: query.length >= 1,
    }));
  };

  const handleSendFeedback = async () => {
    try {
      await createFeedback(
        {
          receiverEmail: state.receiverEmail,
          message: state.feedbackMessage,
        },
        token
      );
      setState((prev) => ({
        ...prev,
        showFeedbackModal: false,
        receiverEmail: "",
        feedbackMessage: "",
        searchQuery: "",
      }));
      alert("Feedback sent successfully!");
    } catch (error) {
      console.error("Feedback submission failed:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar
          onFeedbackOpen={() =>
            setState((prev) => ({ ...prev, showFeedbackModal: true }))
          }
        />
        {state.showFeedbackModal && (
          <FeedbackModal
            state={state}
            setState={setState}
            handleSearchChange={handleSearchChange}
            handleSendFeedback={handleSendFeedback}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;