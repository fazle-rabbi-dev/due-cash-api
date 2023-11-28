const User = require("../database/User")

const userService = {
  async createNewUser(newUser) {
    try {
      const user = await User.createNewUser(newUser);
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  async login(credentials) {
    try {
      const user = await User.login(credentials);
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  async logout(token) {
    try {
      const success = await User.logout(token);
      return success;
    } catch (error) {
      throw error;
    }
  },
  
  async verify(key){
    try {
      const success = await User.verify(key);
      return success;
    } catch (error) {
      throw error;
    }
  },
  
  async loginStatus(token,all){
    try {
      const success = await User.loginStatus(token);
      return success;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = userService;