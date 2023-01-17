const { getUserByEmailModel } = require("../models/usersModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function isNewEmail(req, res, next) {
  try {
    console.log("3");
    const user = await getUserByEmailModel(req.body.email);
    console.log(user);
    // console.log(req.params.id);

    if (user && user.id !== req.params.id) {
      res.status(400).send("Email already in use");
      return;
    }
    console.log("4");
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

async function doesUserExist(req, res, next) {
  try {
    console.log("doesUserExist");

    const user = await getUserByEmailModel(req.body.email);
    console.log(user);

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
    console.log("verifyPassword");

    let user = req.body.user;
    // console.log(user);

    let password;
    if (req.body.currentPassword) {
      password = req.body.currentPassword;
      console.log("current", password);
    } else {
      password = req.body.password;
      console.log("reg ", password);
    }

    bcrypt.compare(password, user.password, (err, result) => {
      console.log("comparing");

      if (err) {
        res.status(400).send(err);
        console.error(err);
        return;
      }
      if (result) {
        console.log(result);

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
  isNewEmail,
  passwordsMatch,
  hashPassword,
  verifyPassword,
  doesUserExist,
};
