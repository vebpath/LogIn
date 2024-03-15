const express = require("express");
const app = express();
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const userRouter = require("./routes/user.js");
const amdinRouter = require("./routes/admin.js");

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(flash());

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "hello world",
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", userRouter);
app.use("/admin", amdinRouter);

app.listen(3000, () => {
  console.log("Started");
});
