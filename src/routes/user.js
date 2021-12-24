const express = require("express");

const {
  register,
  login,
  refreshToken,
  accessToken,
} = require("../controllers/user");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/access-token", accessToken);

router.post("/refresh-token", refreshToken);

module.exports = router;
