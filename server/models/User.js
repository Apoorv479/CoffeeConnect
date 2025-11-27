// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Schema Design (User kaisa dikhega)
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ek email se ek hi account banega
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // Future mein admin features ke liye
    },
  },
  {
    timestamps: true, // Ye khud createdAt aur updatedAt fields bana dega
  }
);

// 2. Method: Password verify karne ke liye (Login ke waqt use hoga)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 3. Middleware: Save karne se pehle Password ko Encrypt karo
userSchema.pre('save', async function (next) {
  // Agar password change nahi hua hai (sirf profile update ho rahi hai), to encryption mat karo
  if (!this.isModified('password')) {
    next();
  }

  // Password ko namak (salt) laga ke encrypt karo
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;