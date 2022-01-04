const LocalStrategy = require("passport-local").Strategy;
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

          const newUser = new User({ username: email, password });
          const savedUser = await newUser.save();

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

          const user = User.findOne({ username: email });
          if (!user) {
            return done(null, false, "Wrong account or password");
          }
        } catch (err) {
          done(err);
        }
      }
    )
  );
};
