const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.createNewUser);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/verify", userController.verify);
router.get("/login-status", userController.loginStatus);

module.exports = router;