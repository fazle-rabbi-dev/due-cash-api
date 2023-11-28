const router = require("express").Router();
const createCustomerRecord = require("./create/create-customer-record");
const createBoughtRecord = require("./create/create-bought-record");
const getCustomersRecord = require("./read/get-customers");
const getCustomerDetails = require("./read/get-customer-details");
const updateCustomerRecord = require("./update/update-customer-record");
const updateBoughtRecord = require("./update/update-bought-record");
const deleteCustomerRecord = require("./delete/delete-customer-record");
const deleteBoughtRecord = require("./delete/delete-bought-record");

router.get("/customer-route", (req,res) => {
  res.send('Customer Route Working')
})

// Create
router.use(createCustomerRecord)
router.use(createBoughtRecord)

// Read
router.use(getCustomersRecord)
router.use(getCustomerDetails)

// Update
router.use(updateCustomerRecord)
router.use(updateBoughtRecord)

// Delete
router.use(deleteCustomerRecord)
router.use(deleteBoughtRecord)

module.exports = router;