import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("userRole");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Anonymous Feedback</h1>
      <div className="space-x-4">
        <button
          className="px-4 py-2 bg-gray-700 rounded"
          onClick={() => navigate("/settings")}
        >
          Settings
        </button>
        <button className="px-4 py-2 bg-red-600 rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;