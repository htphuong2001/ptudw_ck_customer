require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");
require("../helpers/passport")(passport);

const resgiter = async (req, res, next) => {
  try {
    passport.authenticate("local.signup", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash("message", info);
        res.redirect("/user/register");
      } else {
        req.flash("message", info);
        res.redirect("/login");
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
    res.redirect("/auth/register");
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
    res.redirect("/auth/register");
  } catch (error) {
    next(error);
  }
};

const authLocal = async (req, res, next) => {
  try {
    passport.authenticate("local.login", (err, user, info) => {
      console.log("login");
      if (err) next(err);

      if (!user) {
        req.flash("message", info);
        res.redirect("/login");
      } else {
        const accessToken = jwt.sign(
          { username: user.username },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
        req.flash("message", info);
        res.cookie(process.env.COOKIE_NAME_TOKEN, accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 120000,
        });
        res.redirect("/");
      }
    })(req, res, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const authFacebook = async (req, res, next) => {
  try {
    passport.authenticate("facebook", async (err, user) => {
      try {
        if (err) next(err);

        if (!user) {
          req.flash("message", "Login with facebook failed.");
          return res.redirect("/login");
        } else {
          const userExisted = await User.findOne({ username: user.id });

          if (!userExisted) {
            const newUser = new User({
              username: user.id,
              fullname: user.displayName,
            });
            const savedUser = await newUser.save();

            console.log("new user", savedUser);
          }

          const accessToken = jwt.sign(
            { username: user.id },
            process.env.JWT_SECRET,
            {
              expiresIn: "7d",
            }
          );
          res.cookie(process.env.COOKIE_NAME_TOKEN, accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 120000,
          });
          res.redirect("/");
        }
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  resgiter,
  verifyEmail,
  cancelEmail,
  authLocal,
  authFacebook,
};
