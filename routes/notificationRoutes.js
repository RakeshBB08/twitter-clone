// Express is js framework
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");
const Chat = require("../schemas/ChatSchema");
const bcrypt = require("bcrypt");

router.get("/", (req, res, next) => {
  var payload = {
    pageTitle: "Notifications",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };
  res.status(200).render("notificationsPage", payload);
});

module.exports = router;
