const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");
require("../helpers/passport")(passport);

const getRegisterPage = async (req, res, next) => {
  res.render("pages/register", {
    title: "Register",
    message: req.flash("message"),
  });
};

const register = async (req, res, next) => {
  try {
    passport.authenticate("local.signup", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash("message", info);
        res.redirect("/user/register");
      } else {
        req.flash("message", info);
        res.redirect("/user/login");
      }
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    await User.findOneAndUpdate({ username: email }, { is_verified: true });
    req.flash("message", "Verify success");
    res.redirect("/user/register");
  } catch (error) {
    next(error);
  }
};

const cancelEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    await User.findOneAndDelete({ username: email, is_verified: false });
    req.flash("message", "Account has been deleted");
    res.redirect("/user/register");
  } catch (error) {
    next(error);
  }
};

const getLoginPage = async (req, res, next) => {
  res.render("pages/login", {
    title: "Login",
    message: req.flash("message"),
  });
};

const login = (req, res, next) => {
  console.log("login");
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      next(err);
    } else {
      if (!user) {
        res.send(info);
      } else {
        res.send(info);
      }
    }
  })(req, res, next);
};

const refreshToken = async (req, res, next) => {
  res.send("efreshToken");
};

const accessToken = async (req, res, next) => {
  res.send("accessToken");
};

module.exports = {
  getRegisterPage,
  register,
  verifyEmail,
  cancelEmail,
  getLoginPage,
  login,
  refreshToken,
  accessToken,
};
