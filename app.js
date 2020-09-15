const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

///////////////// Disk Storage /////////////////
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const currData = new Date().toDateString().split(" ").join("-");
    cb(null, currData + "-" + file.originalname);
  },
});

// Filter uploaded files based on its type
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

///// Parse the body //////
////////////////////////////
// When we get data from <form>. It uses x-www-form-urlencoded format
// app.use(bodyParser.urlencoded())  // x-www-form-urlencoded  <form>

// When we get data as json. It uses application/json format
app.use(bodyParser.json()); // application/json

// Serve images statically
app.use("/images", express.static(path.join(__dirname, "images")));

// Use multer to upload files
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// By default, all the clients are restricted to access the server/REST api endpoints
// This is because of CORS, we solve this by allowing using headers in the response
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // We could specify certain websites, however, * for all
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

///// Routes /////
//////////////////
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// Error
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  res.status(status).json({
    message: error.message,
  });
});

///// Add Mongoose /////
////////////////////////
mongoose
  .connect("mongodb://localhost:27017/messages", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
