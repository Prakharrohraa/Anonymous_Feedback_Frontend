import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <p className="text-xl text-gray-700 mt-2">Page Not Found</p>
      <button
        onClick={() => navigate("/login")}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Go to Login
      </button>
    </div>
  );
}
