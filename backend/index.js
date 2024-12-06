require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");

const app = express();
const authenticateToken = require("./utilities"); // adjust path as needed
const User = require("./models/user.model");
const Note = require("./models/note.model");

app.use(express.json());

// MongoDB connection
mongoose
  .connect(config.connectionString, {
    // No need for useNewUrlParser and useUnifiedTopology anymore
  })
  .then(async () => {
    console.log("MongoDB connected");

    // Ensure unique index on email
    try {
      // Check and drop the conflicting index if it exists
      const existingIndexes = await User.collection.indexes();
      const indexName = "username_1"; // You can also modify this if you're working with another field

      // Check if the index already exists
      const existingIndex = existingIndexes.find(
        (index) => index.name === indexName
      );
      if (existingIndex) {
        console.log(`Index ${indexName} already exists, dropping it...`);
        await User.collection.dropIndex(indexName);
      }

      // Create the index with desired specifications
      await User.createIndexes();
      console.log("Indexes created/verified");
    } catch (error) {
      console.error("Error creating indexes:", error);
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// CREATE ACCOUNT
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validate input more strictly
  if (!fullName || fullName.trim() === "") {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email || !email.includes("@")) {
    return res
      .status(400)
      .json({ error: true, message: "Valid Email is required" });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: true, message: "Password must be at least 6 characters" });
  }

  try {
    // Check if user already exists
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(409).json({
        error: true,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // Save user
    await user.save();

    // Generate access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10h" }
    );

    return res.status(201).json({
      error: false,
      message: "Account created successfully",
      token: accessToken,
    });
  } catch (error) {
    console.error("Error creating account:", error);

    // More detailed error handling
    if (error.code === 11000) {
      return res.status(409).json({
        error: true,
        message: "A user with this email already exists",
      });
    }

    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: error.message,
    });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  try {
    // Find user by email
    const userInfo = await User.findOne({ email });

    if (!userInfo) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, userInfo.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: true,
        message: "Invalid Credentials",
      });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { userId: userInfo._id, email: userInfo.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10h" }
    );

    return res.json({
      error: false,
      message: "Login Successful",
      email: userInfo.email,
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: error.message,
    });
  }
});



// ADD NOTES
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const user = req.user;

  // More robust validation
  if (!title || title.trim() === "") {
    return res.status(400).json({
      error: true,
      message: "Title is required and cannot be empty",
    });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({
      error: true,
      message: "Content is required and cannot be empty",
    });
  }

  try {
    const note = new Note({
      title: title.trim(),
      content: content.trim(),
      tags: tags || [],
      userId: user.userId,
    });

    await note.save();

    return res.status(201).json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    console.error("Note creation error:", error); // Log for debugging
    return res.status(500).json({
      error: true,
      message: "Failed to create note",
    });
  }
});

// EDIT NOTES
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const user = req.user; // Directly use req.user

  // Check if any changes are provided
  if (!title && !content && !tags && isPinned === undefined) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    // Find the note by ID and user
    const note = await Note.findOne({ _id: noteId, userId: user.userId });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    // Update fields only if provided
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// GET ALL NOTES
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const user = req.user;

  // Validate user from the token
  if (!user || !user.userId) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized access",
    });
  }

  try {
    // Fetch all notes for the authenticated user
    const notes = await Note.find({ userId: user.userId });

    if (!notes.length) {
      return res.status(404).json({
        error: true,
        message: "No notes found",
      });
    }

    return res.json({
      error: false,
      notes,
      message: "Notes retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// DELETE NOTES
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;

  // Validate noteId
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({
      error: true,
      message: "Invalid note ID",
    });
  }

  const user = req.user;

  // Ensure user exists from the authentication middleware
  if (!user || !user.userId) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized access",
    });
  }

  try {
    // Find the note belonging to the authenticated user
    const note = await Note.findOne({ _id: noteId, userId: user.userId });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    // Delete the note
    await note.deleteOne();

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Update isPinned Value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { isPinned } = req.body;
  const user = req.user;

  // Validate noteId
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({
      error: true,
      message: "Invalid note ID",
    });
  }

  // Validate isPinned input
  if (typeof isPinned !== "boolean") {
    return res.status(400).json({
      error: true,
      message: "`isPinned` must be a boolean value",
    });
  }

  try {
    // Find the note by ID and user
    const note = await Note.findOne({ _id: noteId, userId: user.userId });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    // Update the isPinned field
    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
