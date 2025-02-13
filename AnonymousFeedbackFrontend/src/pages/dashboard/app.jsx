import axios from "axios";

import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8080/api";
const token = Cookies.get("authToken");

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

const fetchPendingReviews = () =>
  axios.get(`${API_BASE_URL}/hr/pending-reviews`, { headers });

const fetchAllFeedbacks = () =>
  axios.get(`${API_BASE_URL}/feedback/all`, { headers });

const fetchUsers = () =>
  axios.get(`${API_BASE_URL}/user/getall`, { headers });

const approveReview = (reviewId) =>
  axios.put(`${API_BASE_URL}/hr/approve/${reviewId}`, {}, { headers });

const sendFeedback = (receiverEmail, message) =>
  axios.post(
    `${API_BASE_URL}/feedback/create`,
    { receiverEmail, message },
    { headers }
  );

const fetchAllUsers = async (token) => {
  try {
    const response = await axios.get("http://localhost:8080/api/user/getall", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const createFeedback = async (feedbackData, token) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/feedback/create",
      feedbackData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending feedback:", error);
    throw error;
  }
};

export { fetchAllUsers, createFeedback, fetchAllFeedbacks, fetchPendingReviews, fetchUsers, approveReview};