const getHomePage = async (req, res, next) => {
  console.log("heloo");
  res.render("pages/home", {
    title: "Home",
  });
};

const getRegisterPage = async (req, res, next) => {
  res.render("pages/register", {
    title: "Register",
    message: req.flash("message"),
  });
};

const getLoginPage = async (req, res, next) => {
  res.render("pages/login", {
    title: "Login",
    message: req.flash("message"),
  });
};

module.exports = {
  getHomePage,
  getRegisterPage,
  getLoginPage,
};
