const mongoose = require('mongoose');
const customerSchema = require("../schemas/customerSchema");

module.exports = mongoose.model('customer', customerSchema);