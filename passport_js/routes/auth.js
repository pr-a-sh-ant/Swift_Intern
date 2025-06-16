var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
var db = require("../db");

passport.use(
  new LocalStrategy(function (username, password, cb) {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      function (err, row) {
        if (err) cb(err);
        if (!row) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }

        crypto.pbkdf2(
          password,
          row.salt,
          310000,
          32,
          "sha256",
          function (err, hash) {
            if (err) return cb(err);
            if (!crypto.timingSafeEqual(row.hashed_password, hash)) {
              return cb(null, false, {
                message: "Incorrect username or password.",
              });
            }
            return cb(null, row);
          }
        );
      }
    );
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get("/login", function (req, res) {
  res.render("login", { title: "Login" });
});

router.get("/signup", function (req, res) {
  res.render("signup", { title: "Sign Up" });
});

router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/logout", function (req, res, next) {
  //pssportjs register logout function to req
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post("/signup", function (req, res, next) {
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    function (err, hashpassword) {
      if (err) return next(err);
      db.run(
        "INSERT INTO users (username, hashed_password, salt) VALUES (?,?,?)",
        [req.body.username, hashpassword, salt],
        function (err) {
          if (err) {
            return next(err);
          }
          var user = {
            id: this.lastID, //got after insert
            username: req.body.username,
          };

          req.login(user, function (err) {
            if (err) {
              return next(err);
            }
            res.redirect("/");
          });
        }
      );
    }
  );
});

module.exports = router;
