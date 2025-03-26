import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" // Check saved mode
  );
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // ✅ Email format validation using regex
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // ✅ Basic validation checks
    if (!email || !password) {
      setError("Email and password are required!");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password });

      console.log("Login successful:", response.data);

      // Store authentication token & user name
      localStorage.setItem("token", response.data.token);
      console.log("User Name:", response.data.user.name);
      localStorage.setItem("userName", response.data.user.name); // Save user name

      // Redirect to Dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      className={`flex items-center justify-center h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-lg transition ${
            darkMode
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`${
          darkMode ? "bg-gray-800" : "bg-purple-200"
        } p-6 rounded-lg shadow-lg w-96`}
      >
        <h2
          className={`text-2xl mb-4 text-center ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Login
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <label
          className={`block mb-1 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full mb-3 p-2 rounded focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-700 text-white focus:ring-purple-500"
              : "bg-white text-black focus:ring-purple-500"
          }`}
        />

        <label
          className={`block mb-1 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full mb-4 p-2 rounded focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-700 text-white focus:ring-purple-500"
              : "bg-white text-black focus:ring-purple-500"
          }`}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center ${
            loading
              ? "bg-purple-700 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          } text-white px-4 py-2 rounded transition`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0116 0h-2a6 6 0 10-12 0H4z"
                ></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p
          className={`text-sm mt-3 text-center ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className={`hover:underline ${
              darkMode ? "text-purple-400" : "text-purple-600"
            }`}
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
