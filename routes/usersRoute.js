const express = require("express");

const router = express.Router();
const cors = require("cors");

router.use(express.json());
router.use(cors());

router.post("/login", (req, res) => {
  try {
    res.send(true);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/signup", (req, res) => {
  try {
    res.send(true);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
