const express = require("express");
const router = express.Router();
const path = require("path");
const pwd = path.resolve(__dirname);
const rootDir = path.resolve(pwd, "../../../");
const Users = require(`${rootDir}/models/due-cash/usersModel`);

router.get("/verify", async (req, res) => {
  const { authtoken } = req.query
  
  const user = await Users.findOne({
    authtoken
  })
  
  if(!authtoken || !user){
    return res.status(400).json({
      message: "Bad request"
    })
  }
  
  // Check already confirmed or not
  if(user.isconfirmed){
    return res.status(200).json({
      message: "Account already confirmed"
    })
  }
  
  // Update isConfirmed field
  const ref = await Users.updateOne(
    {
      authtoken
    }, 
    { 
      $set: { isconfirmed: true } 
    }
  )
  
  res.status(200).json({
    message: "Account confirmed"
  })
})

module.exports = router;