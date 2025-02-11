import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/authpage/component/AuthPage";
import VerificationPage from "./pages/verificationpage/component/VerificationPage";
import Cookies from "js-cookie";
import HRDashboard from "./pages/dashboard/component/HRDashboard";
import CEODashboard from "./pages/dashboard/component/CEODashboard";
import ManagerDashboard from "./pages/dashboard/component/ManagerDashboard";
import EmployeeDashboard from "./pages/dashboard/component/EmployeeDashboard";
import NotFound from "./pages/notfound/component/NotFound"; // 404 page
import SettingsPage from "./pages/settingspage/component/SettingsPage";
import SecuritySettings from "./pages/securitysetting/component/SecuritySetting"; // Import SecuritySetting page
import "./App.css";
import "./index.css"

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = Cookies.get("authToken");
  const userRole = Cookies.get("userRole");
  const isVerified = Cookies.get("isVerified");

  if (userRole !== allowedRole) {
    Cookies.remove("authToken");
    Cookies.remove("userRole");
    Cookies.remove("userID");
    Cookies.remove("isVerified");
    return <Navigate to="/404" />; // Redirect to a 404 page if not authorized
  }

  if (!isVerified) {
    return <Navigate to="/verify" />;
  }

  if (!token || !userRole) {
    return <Navigate to="/login" />;
  }

  

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage type="login" />} />
        <Route path="/signup" element={<AuthPage type="signup" />} />
        <Route path="/verify" element={<VerificationPage />} />

        {/* Protected Routes with Role-based Access */}
        <Route
          path="/dashboard/hr"
          element={
            <ProtectedRoute allowedRole="hr">
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/ceo"
          element={
            <ProtectedRoute allowedRole="ceo">
              <CEODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute allowedRole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employee"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/security"
          element={
              <SecuritySettings />
          }
        />

        {/* Settings Routes */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* 404 Page */}
        <Route path="/404" element={<NotFound />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
