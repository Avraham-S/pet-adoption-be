const { getUserByEmailModel } = require("../models/usersModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function isNewUser(req, res, next) {
  try {
    const user = await getUserByEmailModel(req.body.email);
    // console.log(user);

    if (user.length) {
      res.status(400).send("User already exists");
      return;
    }
    next();
  } catch (err) {
    res.status(400).send(err);
  }
}

async function doesUserExist(req, res, next) {
  try {
    console.log("doesUserExist");

    const user = await getUserByEmailModel(req.body.email);

    if (!user.length) throw new Error("Invalid user");
    req.body.user = user[0];
    next();
  } catch (err) {
    res.status(400).send(err);
  }
}

async function verifyPassword(req, res, next) {
  try {
    console.log("verifyPassword");

    const { user, password } = req.body;

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(400).send(err);
        console.error(err);
        return;
      }
      if (result) {
        const token = jwt.sign(
          { id: user.id, isAdmin: !!user.isAdmin },
          process.env.JWT_KEY,
          { expiresIn: "2hrs" }
        );
        req.body.token = token;
        next();
      } else {
        res.status(400).send("Incorrect Password");
      }
    });
  } catch (error) {}
}

function hashPassword(req, res, next) {
  console.log("hashPassword");

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(500).send(err);
      console.error(err);
      return;
    }
    req.body.password = hash;
    next();
  });
}

function passwordsMatch(req, res, next) {
  if (req.body.password === req.body.repassword) next();
  else res.status(403).send("Passwords don't match");
}

module.exports = {
  isNewUser,
  passwordsMatch,
  hashPassword,
  verifyPassword,
  doesUserExist,
};
