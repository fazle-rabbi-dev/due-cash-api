const User = require("../models/UserModel");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const secretKey = process.env.SECRET_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const sendEmail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");

function generateVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

const dbOperation = {
  async createNewUser(newUser) {
    const { name, username, email, password } = newUser;

    // Check username exists or not-exists
    let isExist = await User.findOne({ username: newUser.username });
    if (isExist) {
      throw {
        status: 400,
        message: `Another user already exists with the same username: ${newUser.username}.`
      };
    }

    // Check email exists or not-exists
    isExist = await User.findOne({ email: newUser.email });
    if (isExist) {
      throw {
        status: 400,
        message: `Another user already exists with the same email address: ${newUser.email}.`
      };
    }

    // Encrypt password
    const encryptedPassword = CryptoJS.AES.encrypt(
      newUser.password,
      secretKey
    ).toString();

    const authtoken = jwt.sign({ username }, secretKey);

    // Send confirmation email
    const verificationToken = generateVerificationToken();
    const link = `${process.env.CLIENT_URL}/verify?key=${verificationToken}`;
    const subject = "Due-Cash Account Confirmation";
    const message = `
       <h4>Hi ${name},</h4>
       <p>
         Thanks for joining on Due-Cash! 
         🎉To get started, just
         <a href="${link}"> Verify</a> your account.If you need help, 
         reach out at <a href="mailto:fazlerabbi1343@gmail.com">fazlerabbi1343@gmail.com</a>
       </p>
       </br>
       <i>Cheers, Fazle Rabbi</i>
      `;
    await sendEmail(EMAIL_USER, EMAIL_PASS, email, subject, message);

    // Let's create user
    const user = new User({
      name,
      email,
      username,
      password: encryptedPassword,
      authtoken: verificationToken
    });
    const ref = await user.save();
    return ref;
  },

  async login(credentials) {
    let user;
    if (credentials.email) {
      user = await User.findOne({ email: credentials.email });
    } else {
      user = await User.findOne({ username: credentials.username });
    }

    if (!user) {
      throw {
        status: 404,
        message:
          "We couldn't find any account that match to your email address or username"
      };
    }

    // Check account confirm or not
    if (!user.isconfirmed) {
      throw {
        status: 401,
        message: `Check your email ${user.email} inbox and confirm your account before login.`
      };
    }

    // Decrypt password
    const bytes = CryptoJS.AES.decrypt(user.password, secretKey);
    const plainPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (plainPassword === credentials.password) {
      const token = jwt.sign(
        {
          username: user.username
        },
        secretKey
      );

      const update = { $push: { tokens: token } };

      await User.updateOne(
        {
          username: user.username
        },
        update
      );
      return {authtoken: token};
    } else {
      throw {
        status: 401,
        message: "Wrong email or username or password"
      };
    }
  },

  async logout(token,all) {
    const { username } = jwt.verify(token, secretKey);
    const user = await User.findOne({ username });
    
    if (all) {
      // Logout from all device
      await User.findOneAndUpdate(
        { username },
        { $set: { tokens: [] } },
        { new: true }
      );
    } else {
      // Logout from single device
      await User.findOneAndUpdate(
        { username },
        { $pull: { tokens: token } },
        { new: true }
      );
    }

    return true;
  },

  async verify(key) {
    const user = await User.findOne({
      authtoken: key
    });

    if (!user) {
      throw {
        status: 401,
        message: "Unauthorized access"
      };
    }

    // Check already confirmed or not
    if (user.isconfirmed) {
      throw {
        status: 201,
        message: "Account already confirmed"
      };
    }

    // Update isconfirmed field
    const ref = await User.updateOne(
      {
        authtoken: key
      },
      {
        $set: { isconfirmed: true }
      }
    );
    return ref;
  },

  async loginStatus(token) {
    const { username } = jwt.verify(token, secretKey);
    const user = await User.findOne({ username });
    if (user.tokens.includes(token)) {
      return true;
    }else{
      throw {
        status: 401,
        message: "Unauthorized access"
      }
    }
  }
};

module.exports = dbOperation;
