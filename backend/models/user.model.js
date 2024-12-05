const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

// Remove any existing unique index on username
userSchema.index({ username: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);