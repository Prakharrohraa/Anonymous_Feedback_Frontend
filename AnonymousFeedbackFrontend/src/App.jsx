import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/authpage/index";
import { VerificationContainer as VerificationPage } from "./pages/verificationpage/index";
import Cookies from "js-cookie";
import { HRDashboardContainer as HRDashboard } from "./pages/dashboard/index";
import { CEODashboardContainer as CEODashboard } from "./pages/dashboard/index";
import { ManagerDashboardContainer as ManagerDashboard } from "./pages/dashboard/index";
import { EmployeeDashboard } from "./pages/dashboard/index";
import { NotFound } from "./pages/notfound/index";
import SettingsPage from "./pages/settingspage/index";
import { SecuritySettingsContainer as SecuritySettings } from "./pages/securitysetting/index";
import "./App.css";
import "./index.css";

// AuthRoute component to handle redirection for logged-in users
const AuthRoute = ({ children }) => {
  const token = Cookies.get("authToken");
  const userRole = Cookies.get("userRole");
  const isVerified = Cookies.get("isVerified");

  // If the user is logged in and verified, redirect them to their dashboard
  if (token && userRole) {
    if (isVerified !== 'true') {
      return <Navigate to="/verify" replace />;
    }

    let dashboardPath;
    switch (userRole) {
      case 'hr':
        dashboardPath = '/dashboard/hr';
        break;
      case 'ceo':
        dashboardPath = '/dashboard/ceo';
        break;
      case 'manager':
        dashboardPath = '/dashboard/manager';
        break;
      case 'employee':
        dashboardPath = '/dashboard/employee';
        break;
      default:
        // Clear cookies for invalid roles and redirect to login
        Cookies.remove("authToken");
        Cookies.remove("userRole");
        Cookies.remove("userID");
        Cookies.remove("isVerified");
        return <Navigate to="/login" replace />;
    }

    return <Navigate to={dashboardPath} replace />;
  }

  // If the user is not logged in, allow them to access the login/signup page
  return children;
};

// ProtectedRoute component to handle role-based access
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = Cookies.get("authToken");
  const userRole = Cookies.get("userRole");
  const isVerified = Cookies.get("isVerified");

  // If the user is not logged in, redirect to login
  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // If the user is not verified, redirect to verification page
  if (isVerified !== 'true') {
    return <Navigate to="/verify" replace />;
  }

  // If the user's role does not match the allowed role, redirect to 404
  if (userRole !== allowedRole) {
    return <Navigate to="/404" replace />;
  }

  // If everything is fine, allow access to the route
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Login and Signup Routes */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <AuthPage type="login" />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <AuthPage type="signup" />
            </AuthRoute>
          }
        />

        {/* Verification Route */}
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

        {/* Settings Routes */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/security" element={<SecuritySettings />} />

        {/* 404 Page */}
        <Route path="/404" element={<NotFound />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;