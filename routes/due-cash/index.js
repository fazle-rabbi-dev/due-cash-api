const router = require("express").Router();
const auth = require("./auth");
const customersData = require("./customersData");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Due Cash Home Route",
  });
});

router.use(auth)
router.use(customersData)

module.exports = router;