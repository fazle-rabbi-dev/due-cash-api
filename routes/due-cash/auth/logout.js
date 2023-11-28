const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const pwd = path.resolve(__dirname);
const rootDir = path.resolve(pwd, "../../../");
const Users = require(`${rootDir}/models/due-cash/usersModel`);

const secretKey = process.env.SECRET_KEY;

router.get("/logout", async (req, res) => {
  const token = req.header("authorization");
  const { all } = req.query;

  if (token) {
    try {
      const { username } = jwt.verify(token, secretKey);
      const user = await Users.findOne({username})
      console.log(user)
      if (all) {
        // Logout from all device
        await Users.findOneAndUpdate(
          { username },
          { $set: { tokens: [] } },
          { new: true }
        );
      }
      else{
        // Logout from single device
        await Users.findOneAndUpdate(
          { username },
          { $pull: { tokens: token } },
          { new: true }
        );
      }

      res.status(200).json({
        message: "Logout successful",
      });
      return;
    } catch (e) {
      res.status(401).json({
        message: "Not logged in",
      });
    }
    return;
  }

  res.status(401).json({
    message: "Not logged in",
  });
});

module.exports = router;
