const res = require("express/lib/response");
const authRouter = require("./auth");
const {
  getHomePage,
  getRegisterPage,
  getLoginPage,
} = require("../controllers/index");

const establish = (app) => {
  app.get("/", getHomePage);
  app.get("/register", getRegisterPage);
  app.get("/login", getLoginPage);
  app.use("/auth", authRouter);
};

module.exports = {
  establish,
};
