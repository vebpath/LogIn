const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userModel.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "User doesn't exist" });
      }
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect username or password" });
      }
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
  userModel
    .findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

const isAuthenticatedRedirect = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    next();
  }
};

router.get("/", isAuthenticated, (req, res) => {
  res.render("index.ejs", { user: req.user });
});

router.get("/login", isAuthenticatedRedirect, (req, res) => {
  res.render("login.ejs");
});

router.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("register");
  }
});

router.post("/register", async (req, res) => {
  const { username, email, phone, password } = req.body;

  // Check if email already exists in the database
  const existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    req.flash("error", "Email address is already registered");
    return res.redirect("/register");
  }

  const existingPhoneUser = await userModel.findOne({ phone: phone });
  if (existingPhoneUser) {
    req.flash("error", "Phone number is already registered");
    return res.redirect("/register");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      username: username,
      phone: phone,
      email: email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch (error) {
    req.flash("error", "An error occurred during registration");
    res.redirect("/register");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
module.exports = router;
 