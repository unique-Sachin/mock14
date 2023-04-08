const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.mongoURL);
    console.log(`db connected`);
  } catch (error) {
    console.log(`db connection failed`);
  }
};

module.exports = connection;
