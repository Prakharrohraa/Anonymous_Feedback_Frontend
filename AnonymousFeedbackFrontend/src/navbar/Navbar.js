import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function CEODashboard() {
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [subordinateReviews, setSubordinateReviews] = useState([]);
  const ceoId = Cookies.get("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");

    fetch("http://localhost:8080/api/company/approved-reviews", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setApprovedReviews(data))
      .catch((err) => console.error("Error fetching approved reviews", err));

    fetch(`http://localhost:8080/api/company/${ceoId}/subordinates/reviews`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSubordinateReviews(data))
      .catch((err) => console.error("Error fetching subordinate reviews", err));
  }, [ceoId]);

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("userRole");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Anonymous Feedback</h1>
        <div className="space-x-4">
          <button className="px-3 py-1 bg-gray-700 rounded" onClick={() => navigate("/")}>Home</button>
          <button className="px-3 py-1 bg-gray-700 rounded" onClick={() => navigate("/profile")}>Profile</button>
          <button className="px-3 py-1 bg-gray-700 rounded" onClick={() => navigate("/settings")}>Settings</button>
          <button className="px-3 py-1 bg-red-600 rounded" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">CEO Dashboard</h2>
          <ul>
            <li className="mb-2 cursor-pointer">📌 Approved Company Reviews</li>
            <li className="mb-2 cursor-pointer">📌 Subordinate Reviews</li>
            <li className="mb-2 cursor-pointer">📩 Send Feedback</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-6">
          <h2 className="text-2xl font-bold mb-4">Approved Company Reviews</h2>
          <ul>
            {approvedReviews.map((review) => (
              <li key={review.feedbackId} className="p-2 border-b">{review.comment}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">Subordinate Reviews</h2>
          <ul>
            {subordinateReviews.map((review) => (
              <li key={review.feedbackId} className="p-2 border-b">{review.comment}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
