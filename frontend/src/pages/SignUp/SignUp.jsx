import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Navbar from "../../components/Navbar/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Lottie from "lottie-react";
import Notes from "../../assets/Notes.json";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

const errorVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
};

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
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <motion.div 
        className="relative flex flex-col justify-center h-screen bg-gray-50 overflow-hidden pb-20 md:pb-5 mx-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex items-center justify-center mb-2"
          variants={itemVariants}
        >
          <Lottie
            animationData={Notes}
            loop={true}
            className="size-24 cursor-pointer"
          />
          <motion.h2 
            className="font-Parkinsans font-bold text-4xl md:text-4xl text-black cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            OpenNotes
          </motion.h2>
        </motion.div>

        <motion.div 
          className="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg border-2 border-black"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-3xl font-bold font-Parkinsans text-center text-black"
            variants={itemVariants}
          >
            Sign Up
          </motion.h1>

          <form onSubmit={handleSignUp} className="mt-6">
            <motion.div className="mb-4" variants={itemVariants}>
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
                className="block w-full px-4 py-2 mt-2 font-Parkinsans text-black bg-gray-50 border-2 border-black rounded-md focus:outline-none"
              />
              <AnimatePresence>
                {errorName && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-red-500 text-xs mt-1 pb-1 font-Parkinsans"
                  >
                    {errorName}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div className="mb-4" variants={itemVariants}>
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
                className="block w-full px-4 py-2 mt-2 font-Parkinsans text-black bg-gray-50 border-2 border-black rounded-md focus:outline-none"
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-red-500 text-xs mt-1 pb-1 font-Parkinsans"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div className="mb-4 relative" variants={itemVariants}>
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
                className="block w-full px-4 py-2 mt-2 font-Parkinsans text-black bg-gray-50 border-2 border-black rounded-md focus:outline-none"
              />
              <AnimatePresence>
                {errorPass && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-red-500 text-xs mt-1 pb-1 font-Parkinsans"
                  >
                    {errorPass}
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.button
                type="button"
                className="absolute inset-y-0 right-3 top-6 flex items-center text-black focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiFillEye className="h-5 w-5" />
                )}
              </motion.button>
            </motion.div>

            <motion.div className="mb-4 relative" variants={itemVariants}>
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
                className="block w-full px-4 py-2 mt-2 font-Parkinsans text-black bg-gray-50 border-2 border-black rounded-md focus:outline-none"
              />
              <AnimatePresence>
                {errorConfirmPass && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-red-500 text-xs mt-1 pb-1 font-Parkinsans"
                  >
                    {errorConfirmPass}
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.button
                type="button"
                className="absolute inset-y-0 right-3 top-6 flex items-center text-black focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiFillEye className="h-5 w-5" />
                )}
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {successMessage && (
                <motion.p
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-green-500 text-xs mt-1 pb-4 font-Parkinsans"
                >
                  {successMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="w-full px-4 py-2 font-Parkinsans text-white bg-black/95 rounded-md shadow hover:bg-black/80 focus:outline-none transition-all duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Create Account
            </motion.button>
          </form>

          <motion.p 
            className="mt-6 text-sm text-center font-Parkinsans text-slate-700"
            variants={itemVariants}
          >
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="font-medium font-Parkinsans text-slate-900 hover:underline focus:outline-none"
            >
              Login
            </NavLink>
          </motion.p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SignUp;