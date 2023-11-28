const router = require("express").Router();
const customersData = require("../../../../models/due-cash/customersDataModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

router.get("/get-customer-details", async (req, res) => {
  const token = req.header("authorization");
  const { id } = req.query;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const USER_EXISTS = jwt.verify(token, SECRET_KEY);
    const userName = USER_EXISTS?.username;
    
    // Find customer by given id
    const {createdby} = await customersData.findOne({ _id: id });

    if (createdby === userName) {
      // Find data by id
      const details = await customersData.findOne({ _id: id });
      res.status(200).json({
        success: true,
        creator: userName,
        details,
      });
      return;
    }

    res.status(500).json({
      success: false,
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
