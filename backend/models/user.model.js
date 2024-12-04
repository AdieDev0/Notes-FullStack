const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true }, // Ensuring full name is required
  email: { type: String, required: true, unique: true }, // Ensuring email is unique and required
  password: { type: String, required: true }, // Password is required
  createOn: { type: Date, default: Date.now }, // Fixed typo and used `Date.now` for default
});

module.exports = mongoose.model("User", userSchema);
