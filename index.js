const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToDb = require("./connectToDb");
const { User } = require("./model/User");
// running the server
const PORT = process.env.PORT || 8000;

// connect to the database
connectToDb();

//socket
const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//Init App
const app = express();

// cors
app.use(cors());

// middleware
app.use(express.json());

// Socket.io
let users = [];
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  socket.on("addUser", (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, conversationId }) => {
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const user = await User.findById(senderId);
      console.log("sender :>> ", sender, receiver);
      if (receiver) {
        io.to(receiver.socketId)
          .to(sender.socketId)
          .emit("getMessage", {
            senderId,
            message,
            conversationId,
            receiverId,
            user: { id: user._id, fullName: user.fullName, email: user.email },
          });
      } else {
        io.to(sender.socketId).emit("getMessage", {
          senderId,
          message,
          conversationId,
          receiverId,
          user: { id: user._id, fullName: user.fullName, email: user.email },
        });
      }
    }
  );

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
  // io.emit('getUsers', socket.userId);
});

// Route
app.use("/api", require("./routes/userRoute"));

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} port ${PORT}`)
);
