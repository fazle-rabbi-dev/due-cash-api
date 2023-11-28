const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const pwd = path.resolve(__dirname);
const rootDir = path.resolve(pwd, "../../../");
const Users = require(`${rootDir}/models/due-cash/usersModel`);

const secretKey = process.env.SECRET_KEY;

router.get("/login-status", async (req, res) => {
  const token = req.header("authorization");

  if (token) {
    try {
      const { username } = jwt.verify(token, secretKey);
      const user = await Users.findOne({username})
      if(user.tokens.includes(token)){
        res.status(200).json({
          message: "Logged in",
          username: username
        });
        return;
      }
      res.status(401).json({
        message: "Not logged in",
      });
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
