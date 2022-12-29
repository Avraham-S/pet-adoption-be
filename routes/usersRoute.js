const express = require("express");

const router = express.Router();
const cors = require("cors");
const { signupSchema } = require("../schemas/usersSchema");
const { addUserToDbModel } = require("../models/usersModels");
const { validateBody } = require("../middleware/petsMiddleware");

router.use(express.json());
router.use(cors());

router.post("/login", (req, res) => {
  try {
    res.send(true);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/signup", validateBody(signupSchema), async (req, res) => {
  try {
    const id = await addUserToDbModel(req.body);
    res.send(true);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
