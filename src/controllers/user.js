const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { userValidate } = require("../helpers/validation");
const { accountVerify } = require("../helpers/send_mail");

const getRegisterPage = async (req, res, next) => {
  res.locals.message = req.flash("message");
  res.render("pages/register", {
    title: "Register",
  });
};

const register = async (req, res, next) => {
  try {
    const { email, password, passwordC } = req.body;
    const { error } = userValidate({ email, password });
    let success = true;
    // Validate
    if (error) {
      success = false;
      const errMessage = error.details[0].message;
      req.flash("message", errMessage);
      res.redirect("/user/register");
    }
    const user = await User.findOne({ email });
    if (user) {
      success = false;
      req.flash("message", "Email already exists");
      res.redirect("/user/register");
    }

    // Comfirm password
    if (password != passwordC) {
      success = false;
      req.flash("message", "Confirmed password is not correct");
      res.redirect("/user/register");
    }

    if (success) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      // Saved user
      const newUser = new User({ username: email, password });
      const savedUser = await newUser.save();

      // Send mail verify
      const link = `${req.get("origin")}/user/verify-email/${token}`;
      await accountVerify(email, link);

      setTimeout(async () => {
        try {
          await User.findOneAndDelete({ username: email, is_lock: true });
        } catch (error) {
          next(error);
        }
      }, 15000 * 60);

      req.flash("message", "Success");
      res.redirect("/user/register");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    await User.findOneAndUpdate({ username: email }, { is_lock: false });
    req.flash("message", "Verify success");
    res.redirect("/user/register");
  } catch (error) {
    next(error);
  }
};

const getLoginPage = async (req, res, next) => {
  res.locals.message = req.flash("message");
  res.render("pages/login", {
    title: "Login",
  });
};

const login = async (req, res, next) => {
  res.send("login");
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
  getLoginPage,
  login,
  refreshToken,
  accessToken,
};
