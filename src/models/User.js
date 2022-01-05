const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { func } = require("joi");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
    trim: true,
    min: 6,
    default: null,
  },
  fullname: {
    type: String,
  },
  address: {
    type: String,
  },
  is_lock: {
    type: Boolean,
    default: false,
  },
  is_verified: {
    type: Boolean,
    default: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  token: {
    type: String,
    default: null,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(this.password, salt);
      this.password = hashPassword;
    }
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isCheckPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    next(error);
  }
};

module.exports = mongoose.model("User", UserSchema);
