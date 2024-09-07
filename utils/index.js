const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const chalk = require("chalk");

const URI = process.env.DB_URI;

const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const sendEmail = async (
  senderEmail,
  senderEmailPassword,
  targetEmail,
  subject,
  message
) => {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
    // secure: true, // Set to true if using SSL/TLS
    type: "login",
    auth: {
      user: senderEmail,
      pass: senderEmailPassword
    }
  });

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: senderEmail, // Sender address
      to: targetEmail, // List of recipients
      subject: subject, // Subject line
      // text: message, // Plain text body
      html: message // HTML body (optional)
    });

    console.log(chalk.cyan.bold("[*] Email sent:", info.messageId));
    return true;
  } catch (error) {
    console.error(
      chalk.red.bold("[*] Error occurred while sending email:", error)
    );
    console.log({
      senderEmail,
      senderEmailPassword,
      targetEmail,
      subject,
      message
    });
    return false;
  }
};

const connect = async () => {
  try {
    const status = await mongoose.connect(URI);
    console.log("Connected to db");
    return status;
  } catch (e) {
    return e.message;
  }
};

module.exports = {
  validateEmail,
  connect,
  sendEmail
};
