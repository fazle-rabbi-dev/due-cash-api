/* This file no longer required */

const express = require("express");
const router = express.Router()
const sendEmail = require("./lib/sendMail");

router.post('/send-email', async (req,res) => {
  const body = req.body
  if('senderEmail' in body && 'senderEmailPassword' in body &&
     'targetEmail' in body
  ){
    let subject = 'Warning Message'
    let message = 'Don\'t play with me.I play you better then!'
    if('subject' in body) subject = body.subject;
    if('message' in body) message = body.message;
    
    
    const rsp = await sendEmail(
      body.senderEmail,body.senderEmailPassword,
      body.targetEmail,subject, message
    )
    if(rsp){
      res.status(200).json({
        success: true,
        message: "Email sent successful"
      })
    }
    else{
      throw new Error("Something went wrong 9")
    }
  }
  else{
    console.log("[*] Something went wrong")
    res.status(400).json({
      success: false,
      message: "Email send failed"
    })
  }
})

module.exports = router