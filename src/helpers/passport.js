require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { userValidate } = require("../helpers/validation");
const { accountVerify } = require("../helpers/send_mail");

module.exports = (passport) => {
  passport.use(
    "local.signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const { passwordC } = req.body;

          const { error } = userValidate({ email, password });
          if (error) {
            const errMessage = error.details[0].message;
            return done(null, false, errMessage);
          }

          const user = await User.findOne({ email });
          if (user) {
            return done(null, false, "Email already exists");
          }

          // Comfirm password
          if (password != passwordC) {
            return done(null, false, "Confirmed password is not correct");
          }

          const newUser = new User({
            username: email,
            password,
            is_verified: false,
          });
          const savedUser = await newUser.save();
          console.log(savedUser);

          // Send mail verify
          const token = jwt.sign({ email }, process.env.JWT_SECRET);
          await accountVerify(email, req.get("origin"), token);

          return done(
            null,
            savedUser,
            "Login success. Check your email for confirmation"
          );
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "local.login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const { error } = userValidate({ email, password });
          if (error) {
            const errMessage = error.details[0].message;
            return done(null, false, errMessage);
          }

          const user = await User.findOne({ username: email });
          if (!user || !user.isCheckPassword()) {
            return done(null, false, "Wrong account or password");
          }

          const { is_lock } = user;
          if (is_lock) {
            return done(null, false, "Your account has been locked");
          }

          return done(null, user, "Login success");
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL:
          "https://767e-2402-800-6370-cc96-65f1-2f29-d0f7-f26.ngrok.io/auth/facebook/callback",
        profileFields: ["id", "displayName"],
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          if (!profile) {
            return cb(null, false);
          }

          const user = profile._json;
          return cb(null, user);
        } catch (err) {
          return cb(err);
        }
      }
    )
  );
};
