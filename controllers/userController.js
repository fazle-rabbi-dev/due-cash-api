const User = require("../models/UserModel");
const emailValidate = require(`../utils/emailValidate`);
const userService = require("../services/userService");

const userController = {
  async createNewUser(req, res) {
    const body = req.body;
    if (!body.name || !body.email || !body.username || !body.password) {
      res.status(400).json({
        success: false,
        message:
          "Signup failed due to missing or empty the following keys in request body: (name, email, username and password)"
      });
      return;
    }

    const { name, email, username, password } = body;

    try {
      // Validate email address
      if (!emailValidate(email)) {
        res.status(500).json({
          message: "Unsupported email format"
        });
        return;
      }

      if (password.length < 6) {
        res.status(500).json({
          message: "Password must be at least 6 digit"
        });
        return;
      }

      // Create New User
      const user = await userService.createNewUser(body);
      res.status(201).json({
        success: true,
        message: "Account created successful",
        user
      });
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: error?.message || error
      });
    }
  },

  async login(req, res) {
    const body = req.body;

    if (!body.password || (!body.email && !body.username)) {
      res.status(400).json({
        success: false,
        message:
          "Login failed due to missing or empty the following keys in request body: (email or username and password)"
      });
      return;
    }

    try {
      const user = await userService.login(body);

      res.status(200).json({
        success: true,
        message: "Logged in successful",
        user
      });
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: error?.message || error
      });
    }
  },

  async logout(req, res) {
    const token = req.header("authorization");
    const { all } = req.query;
    
    try {
      if (token) {
        const success = await userService.logout(token,all);
        res.status(200).json({
          success: true,
          message: "Logout successful"
        })
      } else {
        res.status(401).json({
          message: "Unauthorized access"
        });
      }
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: error?.message || error
      });
    }
  },
  
  async verify(req, res){
    if(!req.query.key){
      return res.status(401).json({
        success: false,
        message: "Account confirmation failed"
      })
    }
    
    const { key } = req.query
    
    try {
      const success = await userService.verify(key);
      res.status(200).json({
        success: true,
        message: "Account confirmed successful.Go to due-cash and login now."
      })
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: error?.message || error
      });
    }
  },
  
  async loginStatus(req, res){
    const token = req.header("authorization");
    
    if(!token){
      return res.status(401).json({
        success: false,
        message: "User not logged in"
      })
    }
    
    try {
      const isLoggedIn = await userService.loginStatus(token);
      res.status(200).json({
        success: true,
        message: "User logged in"
      })
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: error?.message || error
      });
    }
  }
};

module.exports = userController;
