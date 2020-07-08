"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

const handleHomepage = (req, res) => {
  res.status(200).render("pages/homepage", { users: users });
};

const handleProfilePage = (req, res) => {
  const id = req.params.id;
  currentUser = users.find((user) => id === user._id);

  let friendsList = currentUser.friends.map((friendId) => {
    return users.find((user) => friendId === user._id);
  });
  res.render("pages/profile", { user: currentUser, friendsList });
};

const handleSignin = (req, res) => {
  res.render("pages/signin");
};

const handleName = (req, res) => {
  let firstName = req.body.firstName;
  let foundUser = users.find((user) => {
    return firstName === user.name;
  });

  if (foundUser !== undefined) {
    res.redirect(`/users/${foundUser._id}`);
  } else {
    res.redirect("*");
  }
};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)
  .get("/users/:id", handleProfilePage)
  .get("/signin", handleSignin)
  .post("/getname", handleName)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
