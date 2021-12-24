const register = async (req, res, next) => {
  res.send("register");
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
  register,
  login,
  refreshToken,
  accessToken,
};
