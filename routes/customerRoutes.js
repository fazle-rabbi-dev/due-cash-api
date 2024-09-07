const router = require("express").Router();
const customerController = require("../controllers/customerController.js");

// customers
router.use("/create-customer-record", customerController.createCustomer);
router.use("/get-customers", customerController.getCustomers);
router.use("/get-customer-details", customerController.getCustomerDetails);
router.use("/update-customer-record", customerController.updateCustomer);
router.use("/delete-customer-record", customerController.deleteCustomer);

router.use("/create-bought-record", customerController.createBoughtRecord);
router.use("/update-bought-record", customerController.updateBoughtRecord);
router.use("/delete-bought-record", customerController.deleteBoughtRecord);

module.exports = router;
