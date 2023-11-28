const router = require("express").Router();
const customersData = require("../../models/CustomerModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

router.get("/delete-customer-record", async (req, res) => {
  const { id } = req.query
  const token = req.header("authorization");

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const USER_EXISTS = jwt.verify(token, SECRET_KEY);
    
    // Find customer with given id
    const customer = await customersData.findOne({ _id: id });
    
    if (customer.createdby === USER_EXISTS.username) {
      // Delete
      await customersData.deleteOne({
        _id: id
      });
      
      res.status(200).json({
        success: true,
        message: "Deleted successful",
      });
      return;
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  } catch (e) {
    console.log(e.message)
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
});

module.exports = router;
