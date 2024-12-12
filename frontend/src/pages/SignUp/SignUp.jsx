import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Navbar from "../../components/Navbar/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorName, setErrorName] = useState(null);
  const [error, setError] = useState(null);
  const [errorPass, setErrorPass] = useState(null);
  const [errorConfirmPass, setErrorConfirmPass] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateName = (name) => name.trim().length > 0;

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateName(name)) {
      setErrorName("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setErrorPass("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setErrorConfirmPass("Passwords do not match");
      return;
    }

    // Reset errors and success message
    setErrorName(null);
    setError(null);
    setErrorPass(null);
    setErrorConfirmPass(null);
    setSuccessMessage(null);

    // SignUp API call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        setSuccessMessage("Account created successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
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
      <div className="relative flex flex-col justify-center h-screen bg-gray-50 overflow-hidden">
        <div className="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg border-2 border-black">
          <h1 className="text-3xl font-bold font-Parkinsans text-center text-black">
            Sign Up
          </h1>
          <form onSubmit={handleSignUp} className="mt-6">
            {/* Name Field */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium font-Parkinsans text-black"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Name"
                placeholder="Enter your name"
                className="block w-full px-4 py-2 mt-2 font-Parkinsans text-black bg-gray-50 border-2 border-black rounded-md  focus:outline-none"
              />
              {errorName && (
                <p className="text-red-500 text-xs mt-1 pb-1 font-Parkinsans">{errorName}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium font-Parkinsans text-black"
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
                className="block w-full px-4 py-2 mt-2 font-Parkinsans text-black bg-gray-50 border-2 border-black rounded-md  focus:outline-none"
              />
              {error && <p className="text-red-500 text-xs mt-1 pb-1 font-Parkinsans">{error}</p>}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium font-Parkinsans text-black"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                placeholder="Enter your password"
                className="block w-full px-4 py-2 mt-2 font-Parkinsans text-black bg-gray-50 border-2 border-black rounded-md  focus:outline-none"
              />
              {errorPass && (
                <p className="text-red-500 text-xs mt-1 pb-1 font-Parkinsans">{errorPass}</p>
              )}
              <button
                type="button"
                className="absolute inset-y-0 right-3 top-6 flex items-center text-black focus:outline-none"
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

            {/* Confirm Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium font-Parkinsans text-black"
              >
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirm Password"
                placeholder="Confirm your password"
                className="block w-full px-4 py-2 mt-2 font-Parkinsans text-black bg-gray-50 border-2 border-black rounded-md  focus:outline-none"
              />
              {errorConfirmPass && (
                <p className="text-red-500 text-xs mt-1 pb-1 font-Parkinsans">{errorConfirmPass}</p>
              )}
              <button
                type="button"
                className="absolute inset-y-0 right-3 top-6 flex items-center text-black focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiFillEye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Success Message */}
            {successMessage && (
              <p className="text-green-500 text-xs mt-1 pb-4 font-Parkinsans">{successMessage}</p>
            )}

            {/* Sign Up Button */}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-Parkinsans text-white bg-black/95 rounded-md shadow hover:bg-black/80 focus:outline-none transition-all duration-300"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Already Have an Account */}
          <p className="mt-6 text-sm text-center text-slate-700">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="font-medium text-slate-900 hover:underline focus:outline-none"
            >
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
