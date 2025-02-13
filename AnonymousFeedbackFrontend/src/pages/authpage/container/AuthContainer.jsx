// src/services/Auth/Container.js
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { authService } from "../app";

export const useAuthContainer = (type) => {
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
      const data = await (type === "login" 
        ? authService.login(formData) 
        : authService.register(formData));

      handleAuthResponse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAuthResponse = (data) => {
    if (type === "signup") {
      localStorage.setItem("registrationEmail", formData.email);
      navigate("/verify");
      return;
    }

    if (!data.verified) {
      setError("Verify Yourself");
      navigate("/verify");
      return;
    }
    Cookies.remove("authToken");
    Cookies.remove("userID");
    Cookies.remove("userRole");
    Cookies.remove("isVerified");
    setUserCookies(data);
    navigateToDashboard(data);
  };

  const setUserCookies = (data) => {
    const role = data.ceo ? "ceo" :
      data.hr ? "hr" :
      data.manager ? "manager" : "employee";

    Cookies.set("authToken", data.token, { expires: 1 });
    Cookies.set("userRole", role, { expires: 1 });
    Cookies.set("isVerified", data.verified, { expires: 1 });
    Cookies.set("userID", data.userId, { expires: 1 });
  };

  const navigateToDashboard = (data) => {
    const path = data.ceo ? "/dashboard/ceo" :
      data.hr ? "/dashboard/hr" :
      data.manager ? "/dashboard/manager" : "/dashboard/employee";
    navigate(path);
  };

  return { formData, error, message, handleChange, handleSubmit };
};