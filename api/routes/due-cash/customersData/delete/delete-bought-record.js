const router = require("express").Router();
const customersData = require("../../../../models/due-cash/customersDataModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/delete-bought-record", async (req, res) => {
  const { customerId, boughtRecordId } = req.body;
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
    const customer = await customersData.findOne({ _id: customerId });
    
    if (customer.createdby === USER_EXISTS.username) {
      // Delete bought record
      const ref = await customersData.updateOne(
        { "_id": customerId },
        { $pull: { "details": { "_id": boughtRecordId } } }
      );
      
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
    console.log(e.message);
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
});

module.exports = router;
