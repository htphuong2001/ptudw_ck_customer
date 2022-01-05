const express = require("express");
const passport = require("passport");
require("../helpers/passport")(passport);

const {
  resgiter,
  verifyEmail,
  cancelEmail,
  authLocal,
  authFacebook,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", resgiter);

router.get("/verify-email/:token", verifyEmail);

router.get("/cancel-email/:token", cancelEmail);

router.post("/login", authLocal);

router.get("/facebook", (req, res, next) => {
  passport.authenticate("facebook")(req, res, next);
});

router.get("/facebook/callback", authFacebook);

module.exports = router;
