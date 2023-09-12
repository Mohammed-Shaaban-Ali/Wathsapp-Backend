const express = require("express");
const cors = require("cors");
const connectToDb = require("./connectToDb");

// const cors = require("cors");
require("dotenv").config();

// connect to the database
connectToDb();

//Init App
const app = express();

// cors
app.use(cors());

// middleware
app.use(express.json());

// Route
app.use("/api", require("./routes/userRoute"));

// running the server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} port ${PORT}`)
);
