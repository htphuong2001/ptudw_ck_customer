const res = require("express/lib/response");
const userRouter = require("./user");

const establish = (app) => {
  app.get("/", (req, res, next) => {
    res.send("Home Page");
  });
  app.use("/user", userRouter);
};

module.exports = {
  establish,
};
