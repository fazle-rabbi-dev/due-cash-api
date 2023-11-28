const router = require("express").Router();
const customersData = require("../../../../models/due-cash/customersDataModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/create-customer-record", async (req, res) => {
  const { name, phone, address } = req.body;
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
    
    if ( name && USER_EXISTS) {
      const newCustomer = new customersData({
        createdby: USER_EXISTS.username,
        name,
        phone: phone || "",
        address: address || "",
      });
      const ref = await newCustomer.save();
      res.status(200).json({
        success: true,
        message: "Created successful",
        ref,
      });
      return;
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  } catch (e) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
});

module.exports = router;
