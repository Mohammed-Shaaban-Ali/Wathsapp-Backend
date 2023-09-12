const router = require("express").Router();
const {
  registerUserCtrl,
  login,
  createConversation,
  getUserConversation,
} = require("../controllers/userController");

//  /api/register
router.post("/register", registerUserCtrl);

//  /api/login
router.post("/login", login);

//  /api/Conversation
router.post("/conversation", createConversation);
//  /api/Conversation
router.get("/conversation/:userId", getUserConversation);

module.exports = router;
