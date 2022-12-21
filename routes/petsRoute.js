const express = require("express");

const router = express.Router();
const cors = require("cors");

const { addPetToDbModel, getPetsModel } = require("../models/petsModels");
const { validateBody, validateQuery } = require("../middleware/petsMiddleware");
const { petsSchema, querySchema } = require("../middleware/schemas/petsSchema");
router.use(express.json());
router.use(cors());

router.post("/", validateBody(petsSchema), (req, res) => {
  try {
    const added = addPetToDbModel(req.body);
    if (added) {
      res.send(req.body);
    } else {
      throw new Error("Cannot add pet");
    }
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});
// ?status&type&height&weight&name
router.get("/", validateQuery(querySchema), (req, res) => {
  try {
    const querys = req.query;

    const data = getPetsModel(querys);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:id", (req, res) => {});

module.exports = router;
