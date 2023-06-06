var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const http = require("http");
const mongoose = require("mongoose");
var indexRouter = require("./routes/index");
const categoryRouter = require("./routes/category");
const offerRouter = require("./routes/offer");
const centerRouter = require("./routes/center");
const userRouter = require("./routes/user");
const serviceRouter = require("./routes/service");
const loginRouter = require("./routes/login");
const cors = require("cors");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const upload = multer();

var app = express();
// app.use(bodyParser.json());
app.use(cors());
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/TuniVita", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));

const filesUploads = fileUpload({ safeFileNames: true, preserveExtension: true });


app.use("/", indexRouter);
app.use("/category", filesUploads , categoryRouter);
app.use("/center", filesUploads , centerRouter);
app.use("/user", userRouter);
app.use("/services", serviceRouter);
app.use("/offers", offerRouter);
app.use("/login", loginRouter);

app.use(express.static(path.join(__dirname, "public")));
app.use(upload.array());
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("Error 404");
});

// error handler


const server = http.createServer(app);
server.listen(5050, () => {
  console.log("app is running on port 5050");
});

global.isEmptyObject = function (value) {
  if (typeof value === "undefined" || value === null) {
    return true;
  }

  if (typeof value === "string" && value.trim() === "") {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }

  return false;
};
//secretKey JWT Token
global.secretKey = "kgnùfdjhnojgnfsjlnfmljkdfsgb66g5fg5fg5fgfgkdg6fg5fg";
