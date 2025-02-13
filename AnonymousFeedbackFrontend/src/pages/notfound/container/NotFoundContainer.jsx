import { useNavigate } from "react-router-dom";
import NotFoundComponent from "../component/NotFoundContainer";
import Cookies from "js-cookie";
export default function NotFound() {
  const navigate = useNavigate();

  Cookies.remove("authToken");
    Cookies.remove("userID");
    Cookies.remove("userRole");
    Cookies.remove("isVerified");
  // Pass navigation logic to the presentational component
  return <NotFoundComponent onNavigateToLogin={() => {
    
    navigate("/login");

}} />;
}