const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const { User } = require("../model/User");
const { Conversation } = require("../model/Conversation");
const { Message } = require("../model/Message");

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password)
    return res
      .status(400)
      .json({ message: "Please fill all required fields " });

  // is user already registered
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "User already exist" });
  // new user amd save it in database
  user = new User({
    fullName,
    email,
  });
  bcrypt.hash(password, 10, (err, hashPassword) => {
    user.set("password", hashPassword);
    user.save();
  });

  return res.status(200).json({ message: "Create account successfully" });
});

module.exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Please fill all required fields " });

  // is user already registered
  let user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "email or passowrd is incorrect" });

  const validateUser = await bcrypt.compare(password, user.password);
  if (!validateUser)
    return res.status(400).json({ message: "email or passowrd is incorrect" });
  const payloud = {
    userId: user._id,
    email: user.email,
  };

  const JWT_SECRET_KEY = "JWT_SECRET_KEY";
  jwt.sign(
    payloud,
    JWT_SECRET_KEY,
    { expiresIn: 84600 },
    async (err, token) => {
      await User.updateOne(
        { _id: user._id },
        {
          $set: { token },
        }
      );
      user.save();
    }
  );

  return res.status(200).json({
    user: { id: user._id, fullName: user.fullName, email: user.email },
    token: user.token,
  });
});

module.exports.getallUders = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await User.find({ _id: { $ne: userId } });
    const userData = Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            fullName: user.fullName,
            receiverId: user._id,
          },
        };
      })
    );
    res.status(200).json(await userData);
  } catch (error) {
    console.log(error);
  }
});

module.exports.createConversation = asyncHandler(async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const newConversation = await Conversation({
      members: [senderId, receiverId],
    });
    await newConversation.save();
    res.status(200).json("Conversation created successfully");
  } catch (error) {
    console.log(error);
  }
});

module.exports.getUserConversation = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });

    const conversationData = Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );
        const user = await User.findById(receiverId);
        return {
          user: {
            receiverId: user._id,
            email: user.email,
            fullName: user.fullName,
          },
          conversationId: conversation._id,
        };
      })
    );
    res.status(200).json(await conversationData);
  } catch (error) {
    console.log(error);
  }
});

module.exports.createMessage = asyncHandler(async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    if (conversationId === "new" && receiverId) {
      const newConversation = await Conversation({
        members: [senderId, receiverId],
      });
      await newConversation.save();

      const newMessage = await Message({
        conversationId: newConversation._id,
        senderId,
        message,
      });
      await newMessage.save();
      return res.status(200).json("message sent successfully");
    }
    const newMessage = await Message({ conversationId, senderId, message });

    await newMessage.save();
    res.status(200).json("Message create successfully");
  } catch (error) {
    console.log(error);
  }
});
module.exports.getmessage = asyncHandler(async (req, res) => {
  try {
    const { conversationId } = req.params;
    let chackMessage = async (conversationId) => {
      const messages = await Message.find({
        conversationId,
      });
      const messageData = Promise.all(
        messages.map(async (message) => {
          const user = await User.findById(message.senderId);
          return {
            user: { id: user._id, email: user.email, fullName: user.fullName },
            message: message.message,
          };
        })
      );
      res.status(200).json(await messageData);
    };

    if (conversationId === "new") {
      const chckconversation = await Conversation.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (chckconversation.length > 0) {
        chackMessage(chckconversation[0]._id);
      } else {
        return res.status(200).json([]);
      }
    } else chackMessage(conversationId);
  } catch (error) {
    console.log(error);
  }
});
