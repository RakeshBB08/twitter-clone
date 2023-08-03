const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
  res.status(200).render("register");
});
router.post("/", async (req, res, next) => {
  var firstName = req.body.firstName.trim();
  var lastName = req.body.lastName.trim();
  var userame = req.body.username.trim();

  var email = req.body.email.trim();
  var password = req.body.password;

  var payload = req.body;

  if (firstName && lastName && userame && email && password) {
    var user = await User.findOne({
      $or: [{ username: userame }, { email: email }],
    }).catch((error) => {
      console.log(error);
      payload.errorMessage = "something went wrong. Try again";
      res.status(200).render("register", payload);
    });

    if (user == null) {
      // No user
      var data = req.body;
      data.password = await bcrypt.hash(password, 10);
      User.create(data).then((user) => {
        req.session.user = user;
        return res.redirect("/");
      });
    } else {
      // User found
      if (email == user.email) {
        payload.errorMessage = "Email Already in Use";
      } else {
        payload.errorMessage = "Username Already in Use";
      }
      res.status(200).render("register", payload);
    }
    // it will wait for awit to done and return
  } else {
    payload.errorMessage = "Make Sure each field has a valid value.";
    res.status(200).render("register", payload);
  }
});

module.exports = router;
