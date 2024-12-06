import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Navbar from "../../components/Navbar/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errorPass, setErrorPass] = useState(null);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // SHOULD AT LEAST 6 CHARACTER BUDDY
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setErrorPass("Password must be at least 6 characters long");
      return;
    }

    setError("");
    setErrorPass(""); // CLEAR PASS ERRRORRRR

    // LOGIN API CALL
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      // Check if response.data contains the accessToken
      if (response.data && response.data.accessToken) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.accessToken);

        // Redirect to dashboard after successful login
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative flex flex-col justify-center h-[600px] bg-gray-50 overflow-hidden">
        <div className="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg ring-2 ring-slate-900">
          <h1 className="text-3xl font-bold text-center text-slate-900">Login</h1>
          <form onSubmit={handleLogin} className="mt-6">
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                placeholder="Enter your email"
                className="block w-full px-4 py-2 mt-2 text-slate-700 bg-gray-50 border border-slate-300 rounded-md focus:border-slate-500 focus:ring-slate-500 focus:outline-none"
              />
              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-900"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="block w-full px-4 py-2 mt-2 text-slate-700 bg-gray-50 border border-slate-300 rounded-md focus:border-slate-500 focus:ring-slate-500 focus:outline-none"
              />
              {errorPass && (
                <p className="text-red-500 text-xs pb-1">{errorPass}</p>
              )}
              <button
                type="button"
                className="absolute inset-y-0 right-3 top-6 flex items-center text-slate-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiFillEye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Forget Password */}
            <div className="text-right mb-4">
              <a
                href="#"
                className="text-sm text-slate-600 hover:underline focus:outline-none"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-slate-900 rounded-md shadow hover:bg-slate-800 focus:outline-none focus:bg-slate-700 transition-all duration-300"
              >
                Login
              </button>
            </div>
          </form>

          {/* Sign Up */}
          <p className="mt-6 text-sm text-center text-slate-700">
            Don't have an account?{" "}
            <NavLink to="/signUp">
              <span className="font-medium text-slate-900 hover:underline focus:outline-none">
                Sign up
              </span>
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
