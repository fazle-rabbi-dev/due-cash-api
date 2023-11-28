const router = require("express").Router();
const customersData = require("../../../../models/due-cash/customersDataModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

router.get("/get-customers", async (req, res) => {
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
    if (USER_EXISTS) {
      const customers = await customersData.find({
        createdby: USER_EXISTS.username,
      });
      res.status(200).json({
        success: true,
        creator: USER_EXISTS.username,
        customers,
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
