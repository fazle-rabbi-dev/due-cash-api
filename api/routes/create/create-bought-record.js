const router = require("express").Router();
const customersData = require("../../models/CustomerModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/create-bought-record", async (req, res) => {
  let { _id, boughtProducts, totalPrice, givenAmount, dueAmount, createdOn } =
    req.body;
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
    
    // Find customer by id
    const customer = await customersData.findOne({ _id })

    if (customer.createdby === USER_EXISTS.username && _id && boughtProducts && totalPrice && givenAmount && USER_EXISTS) {
      /* 
        Create bought record 
        by updating details field
      */
      if (!dueAmount) {
        dueAmount = parseInt(totalPrice) - parseInt(givenAmount);
      }
      const newBoughtDetails = {
        boughtProducts: boughtProducts,
        totalPrice: parseInt(totalPrice),
        givenAmount: parseInt(givenAmount),
        dueAmount,
      };

      if (createdOn) {
        newBoughtDetails["createdOn"] = createdOn;
      }
      await customersData.updateOne(
        { _id },
        { $push: { details: newBoughtDetails } }
      );
      res.status(200).json({
        success: true,
        message: "Added bought record successful",
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
