const express = require("express");
const router = express.Router();
const path = require("path");
const pwd = path.resolve(__dirname);
const rootDir = path.resolve(pwd, "../../../");
const emailValidate = require(`${rootDir}/utils/emailValidate`);
const Users = require(`${rootDir}/models/due-cash/usersModel`);
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");
var crypto = require("crypto");
const sendEmail = require(`${rootDir}/routes/lib/sendMail`)

const secretKey = process.env.SECRET_KEY
const EMAIL_USER = process.env.email_user
const EMAIL_PASS = process.env.email_pass

function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

router.post("/signup", async (req, res) => {
  const body = req.body;
  if (
    "name" in body &&
    "email" in body &&
    "username" in body &&
    "password" in body
  ) {
    const { name, email, username, password } = body;
    try {
      // Check username exists
      const userNameExists = await Users.findOne({ username });
      console.log(userNameExists);
      if (userNameExists) {
        res.status(500).json({
          message: "Username already exists",
        });
        return;
      }

      // Validate email
      if(!emailValidate(email)) {
        res.status(500).json({
          message: "Unsupported email format",
        });
        return;
      }

      // Check email exists
      const emailExists = await Users.findOne({ email });
      if (emailExists) {
        res.status(500).json({
          message: "This email address already using someone else",
        });
        return;
      }

      if (password.length < 6) {
        res.status(500).json({
          message: "Password must be 6 digit",
        });
        return;
      }
      // Encrypt password
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        secretKey
      ).toString();
      
      // Send confirmation email
      const authtoken = generateVerificationToken()
      const link = `http://localhost:3000/verify?authtoken=${authtoken}`
      const subject = "Confirm Your Account on Due-Cash"
      const message = `
       <h4>Hi ${name},</h4>
       <p>
         Thanks for joining on Due-Cash! 
         🎉To get started, just click this link: 
         <a href="${link}">Verify</a> If you need help, 
         reach out at <a href="mailto:fazlerabbi1343@gmail.com">fazlerabbi1343@gmail.com</a>
       </p>
       </br>
       <i>Cheers, Fazle Rabbi</i>
      `
      await sendEmail(
          EMAIL_USER, EMAIL_PASS,
          email, subject, message
        )
      
      // Let's create user
      const newUser = new Users({
        name,
        email,
        username,
        password: encryptedPassword,
        authtoken
      });
      const ref = await newUser.save();
      res.status(200).json({
        success: true,
        message: "Account created successful.Please check your email inbox and confirm your account",
        ref: ref,
      });
    } catch (e) {
      console.log(e)
      res.status(500).json({
        message: "Account creation failed",
      });
    }
    return;
  }
  res.status(500).json({
    message: "Invalid credentials",
  });
});


module.exports = router;