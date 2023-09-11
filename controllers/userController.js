const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const { User } = require("../model/User");

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

  return res.status(200).json(user);
});
