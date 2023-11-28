const router = require("express").Router();
const signupRoute = require("./signup");
const loginRoute = require("./login");
const loginStatusRoute = require("./login-status");
const logoutRoute = require("./logout");
const verifyRoute = require("./verify");

router.use(signupRoute)
router.use(loginRoute)
router.use(loginStatusRoute)
router.use(logoutRoute)
router.use(verifyRoute)

module.exports = router;