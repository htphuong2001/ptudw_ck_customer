const monggose = require("mongoose");

require("dotenv").config();

const uri = process.env.MONGODB_URI;

const connect = async () => {
  try {
    await monggose.connect(uri);
    console.log(`MongoDB::: connected:::success.`);
  } catch (error) {
    console.log(`MongoDB::: connected:::failed error:::${error}`);
  }
};

module.exports = { connect };
