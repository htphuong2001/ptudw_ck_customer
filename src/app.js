require("dotenv").config();

const path = require("path");
const express = require("express");
const createError = require("http-errors");
const expressLayouts = require("express-ejs-layouts");
const logger = require("morgan");

const app = express();
const port = process.env.PORT || 8080;

// Logger
app.use(logger("dev"));

// Connect db
require("./helpers/connections_mongodb").connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file
app.use("/assets", express.static(path.join(__dirname, "public")));

// EJS engine
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Router
require("./routes/index").establish(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new createError.NotFound("Page Not Found"));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("pages/error", { layout: false });
});

app.listen(port, () => {
  console.log(`App running at port ${port}`);
});
