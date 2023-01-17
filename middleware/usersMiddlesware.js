const { getUserByEmailModel } = require("../models/usersModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function isNewEmail(req, res, next) {
  try {
    const user = await getUserByEmailModel(req.body.email);

    if (user && user.id !== req.params.id) {
      res.status(400).send("Email already in use");
      return;
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
}

async function doesUserExist(req, res, next) {
  try {
    const user = await getUserByEmailModel(req.body.email);

    if (!user) throw new Error("Invalid user");
    req.body.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
}

async function verifyPassword(req, res, next) {
  try {
    let user = req.body.user;

    let password;
    if (req.body.currentPassword) {
      password = req.body.currentPassword;
    } else {
      password = req.body.password;
    }

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
  } catch (error) {
    return error;
  }
}

function hashPassword(req, res, next) {
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
  isNewEmail,
  passwordsMatch,
  hashPassword,
  verifyPassword,
  doesUserExist,
};
