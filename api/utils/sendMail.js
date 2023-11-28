const nodemailer = require('nodemailer');
const chalk = require("chalk");

async function sendEmail(senderEmail, senderEmailPassword, targetEmail, subject, message) {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: '465',
    secure: true, // Set to true if using SSL/TLS
    auth: {
      user: senderEmail,
      pass: senderEmailPassword
    },
  });

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: senderEmail, // Sender address
      to: targetEmail, // List of recipients
      subject: subject, // Subject line
      // text: message, // Plain text body
      html: message, // HTML body (optional)
    });

    console.log(chalk.cyan.bold('[*] Email sent:', info.messageId));
    return true
  } catch (error) {
    console.error(chalk.red.bold('[*] Error occurred while sending email:', error));
    return false
  }
}

module.exports = sendEmail