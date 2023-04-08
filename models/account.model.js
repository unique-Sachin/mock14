const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    address: { type: String },
    initBal: { type: Number, required: true },
    adharNo: { type: Number, required: true },
    panNo: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const accountModel = mongoose.model("account", schema);

module.exports = accountModel;
