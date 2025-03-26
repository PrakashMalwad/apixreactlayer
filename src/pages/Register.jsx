import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" // Check saved mode
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Invalid email format.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters long and include an uppercase letter and a number.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, formData);
      setSuccess("Registration successful! You can now login.");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div
      className={`flex items-center justify-center h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* 🌗 Dark/Light Mode Toggle */}
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
          Register
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

        {/* Name Field */}
        <label
          className={`block mb-1 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full mb-3 p-2 rounded focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-700 text-white focus:ring-purple-500"
              : "bg-white text-black focus:ring-purple-500"
          }`}
        />

        {/* Email Field */}
        <label
          className={`block mb-1 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full mb-3 p-2 rounded focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-700 text-white focus:ring-purple-500"
              : "bg-white text-black focus:ring-purple-500"
          }`}
        />

        {/* Password Field */}
        <label
          className={`block mb-1 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full mb-3 p-2 rounded focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-700 text-white focus:ring-purple-500"
              : "bg-white text-black focus:ring-purple-500"
          }`}
        />

        {/* Confirm Password Field */}
        <label
          className={`block mb-1 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full mb-4 p-2 rounded focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-700 text-white focus:ring-purple-500"
              : "bg-white text-black focus:ring-purple-500"
          }`}
        />

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center ${
            loading
              ? "bg-purple-700 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          } text-white px-4 py-2 rounded transition`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <p
          className={`text-sm mt-3 text-center ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <Link
            to="/"
            className={`hover:underline ${
              darkMode ? "text-purple-400" : "text-purple-600"
            }`}
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
