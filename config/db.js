const mongoose = require("mongoose");

require("dotenv").config({
  path: "variables.env",
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("Connected");
  } catch (error) {
    console.log("Error");
    console.log(error);

    process.exit(1);
  }
};

module.exports = connectDB;
