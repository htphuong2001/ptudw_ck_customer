const express = require("express");
const createError = require("http-errors");

const router = require("./routes/index");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

require("./helpers/connections_mongodb").connect();

router.establish(app);

app.use((req, res, next) => {
  next(new createError.NotFound("Page Not Found"));
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    messsage: err.message,
  });
});

app.listen(port, () => {
  console.log(`App running at port ${port}`);
});
