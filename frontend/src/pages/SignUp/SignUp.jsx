import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Navbar from "../../components/Navbar/Navbar";
import { NavLink } from "react-router-dom";

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

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateName = (name) => name.trim().length > 0;

  const handleSignUp = (e) => {
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

    // Reset errors
    setErrorName(null);
    setError(null);
    setErrorPass(null);
    setErrorConfirmPass(null);

    // Add sign-up logic here
  };

  return (
    <>
      <Navbar />

      <div className="relative flex flex-col justify-center h-[600px] bg-gray-50 overflow-hidden">
        <div className="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg ring-2 ring-slate-900">
          <h1 className="text-3xl font-bold text-center text-slate-900">
            Sign Up
          </h1>
          <form onSubmit={handleSignUp} className="mt-6">
            {/* Name Field */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-900"
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
                className="block w-full px-4 py-2 mt-2 text-slate-700 bg-gray-50 border border-slate-300 rounded-md focus:border-slate-500 focus:ring-slate-500 focus:outline-none"
              />
              {errorName && (
                <p className="text-red-500 text-xs pb-1">{errorName}</p>
              )}
            </div>

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
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

            {/* Confirm Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-900"
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
                className="block w-full px-4 py-2 mt-2 text-slate-700 bg-gray-50 border border-slate-300 rounded-md focus:border-slate-500 focus:ring-slate-500 focus:outline-none"
              />
              {errorConfirmPass && (
                <p className="text-red-500 text-xs pb-1">{errorConfirmPass}</p>
              )}
              <button
                type="button"
                className="absolute inset-y-0 right-3 top-6 flex items-center text-slate-600 focus:outline-none"
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

            {/* Sign Up Button */}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-slate-900 rounded-md shadow hover:bg-slate-800 focus:outline-none focus:bg-slate-700 transition-all duration-300"
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
