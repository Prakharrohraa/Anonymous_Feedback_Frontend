import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png"; // Import the logo

export default function AuthPage({ type }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/${type === "login" ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) throw new Error(data.message || data || "Something went wrong");

      console.log("Response Data:", data);
      console.log(type);

      if (type === "signup") {
        
        localStorage.setItem("registrationEmail",formData.email);
        navigate("/verify");
        return;
      }
      console.log(data.verified);

      if (!data.verified) {
        setError("Verify Yourself");
        navigate("/verify");
        return;
      }

      let role;
      if (data.ceo) role = "ceo";
      else if (data.hr) role = "hr";
      else if (data.manager) role = "manager";
      else role = "employee";

      Cookies.set("authToken", data.token, { expires: 1 });
      Cookies.set("userRole", role, { expires: 1 });
      Cookies.set("isVerified", data.verified, { expires: 1 });
      Cookies.set("userID", data.userId, { expires: 1 });
      console.log(data);

      if (data.ceo) {
        navigate("/dashboard/ceo");
      } else if (data.hr) {
        navigate("/dashboard/hr");
      } else if (data.manager) {
        navigate("/dashboard/manager");
      } else {
        navigate("/dashboard/employee");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Anonymous Feedback</h1>
        <div className="space-x-4">
          <button
            className="px-4 py-2 bg-gray-700 rounded"
            onClick={() => navigate(type === "login" ? "/signup" : "/login")}
          >
            {type === "login" ? "Sign Up" : "Login"}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-grow justify-center items-center">
        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-96">
          <img src={logo} alt="App Logo" className="mx-auto mb-6 w-24 h-24 rounded-full" />
          <h1 className="text-lg font-semibold text-center mb-2">Welcome to Anonymous Feedback</h1>
          <h2 className="text-2xl font-bold text-center mb-6">
            {type === "login" ? "Login" : "Sign Up"}
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-700 text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {type === "login" ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4">
            {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate(type === "login" ? "/signup" : "/login")}
            >
              {type === "login" ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}