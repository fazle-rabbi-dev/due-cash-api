const mongoose = require("mongoose");

// Define a schema for the details subdocument
const detailsSchema = new mongoose.Schema({
  boughtProducts: String,
  totalPrice: Number,
  givenAmount: Number,
  dueAmount: Number,
  createdOn: {
    type: Date,
    default: Date.now
  }
});

// Define the main schema for the object
const customerSchema = new mongoose.Schema({
  createdby: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  details: {
    type: [detailsSchema],
    default: []
  }, // Array of 'details' subdocuments
  paymentStatus: {
    type: String,
    default: "unpaid"
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = customerSchema;
