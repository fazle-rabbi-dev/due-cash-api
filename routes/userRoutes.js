const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/auth/signup", userController.createNewUser);
router.post("/auth/login", userController.login);
router.get("/auth/logout", userController.logout);
router.get("/auth/verify", userController.verify);
router.get("/auth/login-status", userController.loginStatus);

module.exports = router;