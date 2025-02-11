import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function VerificationPage() {  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: localStorage.getItem("registrationEmail") || "", 
    verificationCode: "" 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Clear stored email after 10 minutes
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
    <div className="flex flex-col h-screen w-screen bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Account Verification</h1>
        <div className="space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-grow items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Verify Your Account
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded-lg text-center">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-600 text-white rounded-lg text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* <Input
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="bg-gray-700 text-white"
            /> */}
            
            <Input
              type="text"
              name="verificationCode"
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={formData.verificationCode}
              onChange={handleChange}
              className="bg-gray-700 text-white"
              required
            />

            <Button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Verify Account
            </Button>
          </form>

          <div className="mt-4 text-center text-gray-400">
            <p>
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className={`text-blue-400 hover:text-blue-300 ${
                  isResending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}