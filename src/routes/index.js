const res = require("express/lib/response");
const userRouter = require("./user");
const { getHomePage } = require("../controllers/index");

const establish = (app) => {
  app.get("/", getHomePage);
  app.use("/user", userRouter);
};

module.exports = {
  establish,
};
