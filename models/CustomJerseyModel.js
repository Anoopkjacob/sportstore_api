const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const JerseyTemplate = new mongoose.Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: "registrations",
  },
  date: {
    type: Number,
    default: Date.now,
  },
  default: {
    type: String,
    default: "not selected",
  },
  primarycolor: {
    type: String,
    required: true,
  },
  Secondarycolor: {
    type: String,
    required: true,
  },
  imageurl: {
    type: String,
    default: "no url",
  },
  sizexl: {
    type: Number,
    required: true,
  },
  sizexxl: {
    type: Number,
    required: true,
  },
  sizexxxl: {
    type: Number,
    required: true,
  },
  discrption: {
    type: String,
    default: 1,
  },
  status: {
    type: String,
    default: "pending",
  },
  payement: {
    type: String,
    default: "not paid",
  },
  shippingaddress: {
    type: String,
    default: "null",
  },
  pin: {
    type: String,
    default: "null",
  },
  city: {
    type: String,
    default: "Kottayam",
  },
  deliverycontact: {
    type: String,
    default: "null",
  },
  deliveryid: {
    type: String,
    default: "null",
  },
  Amount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("jersey_orders", JerseyTemplate);
