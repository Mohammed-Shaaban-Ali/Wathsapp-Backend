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
router.get("/users", getallUders);

//  /api/Conversation
router.post("/conversation", createConversation);
//  /api/Conversation
router.get("/conversation/:userId", getUserConversation);

//  /api/meessage
router.post("/meessage", createMessage);
//  /api/meessage/:conversationId
router.get("/meessage/:conversationId", getmessage);

module.exports = router;
