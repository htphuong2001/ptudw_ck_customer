const mongoose = require("mongoose");
const schema = mongoose.Schema();

const UserSchema = new schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    trim: true,
    min: 2,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 6,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  address: {
    type: String,
  },
  is_lock: {
    type: Boolean,
    default: false,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", UserSchema);
