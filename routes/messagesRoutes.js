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
    pageTitle: "Inbox",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };
  res.status(200).render("inboxPage", payload);
});

router.get("/new", (req, res, next) => {
  var payload = {
    pageTitle: "New message",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };
  res.status(200).render("newMessages", payload);
});

router.get("/:chatId", async (req, res, next) => {
  var userId = req.session.user._id;
  var chatId = req.params.chatId;
  var isValid = mongoose.isValidObjectId(chatId);

  var payload = {
    pageTitle: "Chat",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };

  if (!isValid) {
    payload.errorMessage =
      "Chat does not exists or you don't have permisson to view it.";
    return res.status(200).render("chatPage", payload);
  }

  var chat = await Chat.findOne({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  }).populate("users");

  if (chat == null) {
    // Check if chat id is relly user id
    var userFound = await User.findById(chatId);
    if (userFound != null) {
      // get chat using user id
      chat = await getChatByUserId(userFound._id, userId);
    }
  }

  if (chat == null) {
    payload.errorMessage =
      "Chat does not exists or you don't have permisson to view it. ";
  } else {
    payload.chat = chat;
  }
  res.status(200).render("chatPage", payload);
});

function getChatByUserId(userLoggedIn, otherUserId) {
  return Chat.findOneAndUpdate(
    {
      isGroupChat: false,
      users: {
        $size: 2,
        $all: [
          { $elemMatch: { $eq: new mongoose.Types.ObjectId(userLoggedIn) } },
          { $elemMatch: { $eq: new mongoose.Types.ObjectId(otherUserId) } },
        ],
      },
    },
    {
      $setOnInsert: {
        users: [userLoggedIn, otherUserId],
      },
    },
    {
      new: true,
      upsert: true,
    }
  ).populate("users");
}

module.exports = router;
