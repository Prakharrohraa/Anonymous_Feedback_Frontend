import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VerificationComponent from "../component/VerificationPageContainer";

export default function VerificationContainer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: localStorage.getItem("registrationEmail") || "", 
    verificationCode: "" 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem("registrationEmail");
    }, 600000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.text();
      if (!response.ok) throw new Error(data || "Verification failed");

      localStorage.removeItem("registrationEmail");
      setSuccess("Account verified successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setIsResending(true);
  
    try {
      const response = await fetch("http://localhost:8080/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await response.text();
      if (!response.ok) throw new Error(data || "Failed to resend OTP");
      setSuccess("Verification code resent successfully!");
    } catch (err) {        
      setError(err.message);
    } finally {
      setTimeout(() => setIsResending(false), 5000);
    }
  };

  return (
    <VerificationComponent
      formData={formData}
      error={error}
      success={success}
      isResending={isResending}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onResendOTP={handleResendOTP}
      onNavigateToLogin={() => navigate("/login")}
    />
  );
}