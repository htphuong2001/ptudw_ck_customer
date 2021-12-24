const getHomePage = async (req, res, next) => {
  console.log("heloo");
  res.render("pages/home", {
    title: "Home",
  });
};

module.exports = {
  getHomePage,
};
