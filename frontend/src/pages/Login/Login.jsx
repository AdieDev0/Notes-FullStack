import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Navbar from "../../components/Navbar/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Lottie from "lottie-react";
import Notes from "../../assets/Notes.json";

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
      <div className="relative flex flex-col justify-center min-h-screen bg-gray-50 overflow-hidden pb-20 md:pb-5 mx-4 ">
        <div className="flex items-center justify-center mb-2">
          <Lottie
            animationData={Notes}
            loop={true}
            className="size-24 cursor-pointer"
          />
          <h2 className="font-Parkinsans font-bold text-4xl md:text-4xl text-black cursor-pointer">
            OpenNotes
          </h2>
        </div>
        <div className="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg border-2 border-black">
          <h1 className="text-3xl font-bold text-center font-Parkinsans text-slate-900">
            Login
          </h1>
          <form onSubmit={handleLogin} className="mt-6">
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium font-Parkinsans text-slate-900"
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
                className="block w-full px-4 py-2 mt-2 text-black bg-gray-50 border-2 border-black rounded-md font-Parkinsans"
              />
              {error && (
                <p className="text-red-500 text-xs mt-1 pb-1 font-Parkinsans">
                  {error}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium font-Parkinsans text-slate-900"
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
                className="block w-full px-4 py-2 mt-2 text-black bg-gray-50 border-2 border-black rounded-md"
              />
              {errorPass && (
                <p className="text-red-500 text-xs mt-1 pb-1 font-Parkinsans">
                  {errorPass}
                </p>
              )}
              <button
                type="button"
                className="absolute inset-y-0 right-3 top-6 flex items-center font-Parkinsans text-black focus:outline-none"
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
                className="text-sm text-black/70 font-Parkinsans hover:underline focus:outline-none"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white font-Parkinsans bg-black/95 rounded-md shadow hover:bg-black/80 focus:outline-none transition-all duration-300"
              >
                Login
              </button>
            </div>
          </form>

          {/* Sign Up */}
          <p className="mt-6 text-sm text-center font-Parkinsans text-slate-700">
            Don't have an account?{" "}
            <NavLink to="/signUp">
              <span className="font-medium font-Parkinsans text-slate-900 hover:underline focus:outline-none">
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
