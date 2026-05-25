import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-red-500 text-xl mb-4">
          You are not authorized to access this page
        </h2>

        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
