const router = require("express").Router();
const { registerUserCtrl, login } = require("../controllers/userController");

//  /api/auth/register
router.post("/register", registerUserCtrl);

//  /api/auth/login
router.post("/login", login);

module.exports = router;
