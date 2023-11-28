const express = require("express");
const router = express.Router();
const path = require("path");
const pwd = path.resolve(__dirname);
const rootDir = path.resolve(pwd, "../../../");
const emailValidate = require(`${rootDir}/utils/emailValidate`);
const Users = require(`${rootDir}/models/due-cash/usersModel`);
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");

const secretKey = process.env.SECRET_KEY;

// Decrypt
// var bytes = CryptoJS.AES.decrypt(ciphertext, "secret key 123");
// var originalText = bytes.toString(CryptoJS.enc.Utf8);
// =====================

router.get("/login", (req,res) => {
  console.log(req.cookies?.token)
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZyIiwiaWF0IjoxNjkzOTgyMDQ1fQ.6JiIfDqFSIxvGRPA3UE9yqx6d-0an5rFhDLnek42bkM"
  res.cookie("token", token, {
    httpOnly: true,
    // samesite: 'None'
  })
  res.json({
    message: "Cookie set successful"
  })
})

router.post("/login", async (req, res) => {
  // If valid cookie found then logged in user
  /*if("token" in req.cookies){
    const { token } = req.cookies
    const verifyToken = jwt.verify(token, secretKey)
    console.log(verifyToken)
    res.json({
      message: "Already logged in"
    })
    return;
  }*/
  
  
  const body = req.body;
  if ("emailOrUsername" in body && "password" in body) {
    const { emailOrUsername, password } = body;
    try {
      let user = await Users.findOne({
        username: emailOrUsername,
      });
      
      if (!user) {
        user = await Users.findOne({
          email: emailOrUsername,
        });
      }
      
      if (!user) {
        res.status(500).json({
          message: "We couldn't find an account with this username or email",
        });
        return;
      }
      
      // Check account confirmed or not
      if(!user.isconfirmed){
        return res.status(401).json({
          message: `Check your email (${user.email}) inbox and confirm your account`
        })
      }
      
      // Decrypt password
      const bytes = CryptoJS.AES.decrypt(user.password, secretKey);
      const plainPassword = bytes.toString(CryptoJS.enc.Utf8);
      
      
      // Check password
      if (plainPassword === password) {
        /*
          Generate token 
          and store in db
          and set in cookie
        */
        const token = jwt.sign(
          {
            username: user.username,
          },
          secretKey
        );
        
        const update = { $push: { tokens: token } };

        await Users.updateOne({
          username: user.username,
        }, update);
        
        res.cookie("token", token, {
          // httpOnly: true,
          // secure: false,
          // samesite: false
        })
        
        res.status(200).json({
          message: "Logged in successful",
          token,
          success: true
        });
        return;
      }
      res.status(401).json({
        message: "Wrong password",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Login failed",
      });
    }
    return;
  }
  res.status(500).json({
    message: "Invalid credentials",
  });
});

module.exports = router;
