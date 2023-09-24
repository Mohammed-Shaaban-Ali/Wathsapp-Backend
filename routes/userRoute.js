const router = require("express").Router();
const {
  registerUserCtrl,
  login,
  createConversation,
  getUserConversation,
  createMessage,
  getmessage,
  getallUders,
} = require("../controllers/userController");

//  /api/register
router.post("/register", registerUserCtrl);

//  /api/login
router.post("/login", login);

//  /api/users
router.get("/users/:userId", getallUders);

//  /api/Conversation
router.post("/conversations", createConversation);
//  /api/Conversation
router.get("/conversations/:userId", getUserConversation);

//  /api/meessage
router.post("/message", createMessage);
//  /api/meessage/:conversationId
router.get("/message/:conversationId", getmessage);

module.exports = router;
