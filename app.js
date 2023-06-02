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

var app = express();
mongoose.set('strictQuery', true);
mongoose
  .connect("mongodb://127.0.0.1:27017/TuniVita", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/category", categoryRouter);
app.use("/center", centerRouter);
app.use("/user", userRouter);
app.use("/services", serviceRouter);
app.use("/offers", offerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("Error 404");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const server = http.createServer(app);
server.listen(5050, () => {
  console.log("app is running on port 5050");
});
