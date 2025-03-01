/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useApi, ENDPOINTS } from "../../../hooks/useApi";

interface LoginResponse {
  token: string;
  username: string;
}

interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { execute, isLoading, error } = useApi<LoginResponse>();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage("");
  };

  const getErrorMessage = (error: any): string => {
    if (!error) return "";

    // Handle specific error codes
    switch (error.code) {
      case "AUTH_REQUIRED":
        return "Please log in to continue";
      case "ERROR_401":
        return "Invalid username or password";
      case "ERROR_403":
        return "Access denied";
      case "NETWORK_ERROR":
        return "Unable to connect to the server. Please check your internet connection";
      case "TIMEOUT_ERROR":
        return "Request timed out. Please try again";
      default:
        return error.message || "An unexpected error occurred";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    // Basic form validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      const response = await execute({
        endpoint: ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        body: formData,
      });

      if (response.error) {
        setErrorMessage(getErrorMessage(response.error));
        return;
      }

      if (!response.data) {
        setErrorMessage("No response from server");
        return;
      }

      if (response.data.token) {
        // Store auth data
        const { token, username } = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("username", username.toString().trim());
        // Clear form and errors
        setFormData({ username: "", password: "" });
        setErrorMessage("");

        // Navigate to dashboard
        navigate("/notes");
      } else {
        setErrorMessage("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An unexpected error occurred");
    }
  };

  // Combine hook error and local error message
  const displayError = errorMessage || (error ? getErrorMessage(error) : "");
  return (
    <>
      <div className="max-w-lg mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-center font-bold text-2xl mb-6 text-gray-800">
            Login
          </h1>

          {displayError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {displayError}
            </div>
          )}

          <form className="space-y-4 w-md" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-300 mt-6 cursor-pointer ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            <p>
              Don't have an account?{" "}
              <Link
                className="text-blue-600 hover:text-blue-800 font-medium"
                to="/register"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
