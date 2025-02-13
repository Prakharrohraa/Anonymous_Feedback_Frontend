import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import SecuritySettingsComponent from "../component/SecuritySettingComponent";

export default function SecuritySettingsContainer() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  
  const token = Cookies.get("authToken");
  const userId = Cookies.get("userId"); // Ensure correct casing
  const userRole = Cookies.get("userRole"); // Fetch the user role

  // Function to determine where to navigate based on role
  const handleBack = () => {
    navigate(`dashboard/${userRole}`);
  };

  const handleChangePassword = () => {
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    axios
      .put(
        `http://localhost:8080/api/user/${userId}/update`,
        { password: newPassword },
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
    <SecuritySettingsComponent
      newPassword={newPassword}
      confirmPassword={confirmPassword}
      error={error}
      success={success}
      setNewPassword={setNewPassword}
      setConfirmPassword={setConfirmPassword}
      handleChangePassword={handleChangePassword}
      handleBack={handleBack} // Passing handleBack to the component
    />
  );
}
