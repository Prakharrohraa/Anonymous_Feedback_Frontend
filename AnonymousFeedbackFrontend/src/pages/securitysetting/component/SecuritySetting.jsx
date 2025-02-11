import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function SecuritySettings() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = Cookies.get("authToken");
  const userId = Cookies.get("userID");

  const handleChangePassword = () => {
    // Reset error and success messages
    setError("");
    setSuccess("");

    // Validate inputs
    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Call API to update password
    axios
      .put(
        `http://localhost:8080/api/user/${userId}/update`,
        {
          password: newPassword, // Send the new password
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setSuccess("Password updated successfully.");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        console.error("Error updating password:", err);
        setError(err.response?.data?.message || "Failed to update password.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {/* Blurred Background Container */}
      <div className="backdrop-blur-lg bg-opacity-50 bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Security Settings</h2>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500 text-white rounded-lg">
            {success}
          </div>
        )}

        {/* Change Password Section */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-white mb-2">
            Change Password
          </label>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 border rounded-lg mb-3 text-black"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-3 border rounded-lg mb-3 text-black"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleChangePassword}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}