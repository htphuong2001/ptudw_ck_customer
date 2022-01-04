const express = require("express");

const {
  getRegisterPage,
  register,
  verifyEmail,
  getLoginPage,
  login,
  refreshToken,
  accessToken,
} = require("../controllers/user");

const router = express.Router();

router.get("/register", getRegisterPage);

router.post("/register", register);

router.get("/verify-email/:token", verifyEmail);

router.get("/login", getLoginPage);

router.post("/login", login);

router.post("/access-token", accessToken);

router.post("/refresh-token", refreshToken);

module.exports = router;
