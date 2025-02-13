// src/services/Auth/index.js
import { useNavigate } from "react-router-dom";
import { useAuthContainer } from "./container/AuthContainer";
import { AuthComponent } from "./component/AuthComponent";

export const AuthPage = ({ type }) => {
  const navigate = useNavigate();
  const authProps = useAuthContainer(type);

  return <AuthComponent {...authProps} type={type} navigate={navigate} />;
};