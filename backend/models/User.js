const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
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
  },
  oriPassword: { 
    type: String, 
    required: false 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'],
    default: 'user'
  },
 
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
