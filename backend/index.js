require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");

const app = express();
const User = require("./models/user.model"); // Ensure this model is defined

// MongoDB connection
mongoose
  .connect(config.connectionString)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process if DB connection fails
  });

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// CREATE ACCOUNT
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res.status(400).json({ error: true, message: "Full name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ error: true, message: "Password is required" });
  }

  try {
    // Check if the user already exists based on the email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "User with this email already exists",
      });
    }

    // Hash password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    const accessToken = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });

    return res.status(201).json({
      message: "Account created successfully",
      token: accessToken,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const userInfo = await User.findOne({ email });

    if (!userInfo) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, userInfo.password);

    if (isPasswordValid) {
      const accessToken = jwt.sign({ id: userInfo._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m", // Valid for 25 days
      });

      return res.json({
        error: false,
        message: "Login Successful",
        email,
        accessToken,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.error("Error during login:", error.message); // Log error for debugging
    return res.status(500).json({
      error: true,
      message: "Server error: " + error.message, // Return the actual error message
    });
  }
});

app.listen(8001, () => {
  console.log("Server is running on port 8001");
});

module.exports = app;
