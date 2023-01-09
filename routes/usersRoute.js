const express = require("express");

const router = express.Router();
const cors = require("cors");
const { signupSchema } = require("../schemas/usersSchema");
const {
  addUserToDbModel,
  getUserByEmailModel,
} = require("../models/usersModels");
const {
  isNewUser,
  passwordsMatch,
  hashPassword,
  verifyPassword,
  doesUserExist,
} = require("../middleware/usersMiddlesware");
const { validateBody } = require("../middleware/petsMiddleware");
const bcrypt = require("bcrypt");

router.use(express.json());
router.use(cors());

router.post("/login", doesUserExist, verifyPassword, async (req, res) => {
  try {
    const { user, token } = req.body;
    res.send({ name: user.firstName, id: user.id, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post(
  "/signup",
  validateBody(signupSchema),
  passwordsMatch,
  hashPassword,
  isNewUser,
  async (req, res) => {
    try {
      const id = await addUserToDbModel(req.body);
      res.send(true);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
