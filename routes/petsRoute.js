const express = require("express");

const router = express.Router();
const cors = require("cors");

const {
  addPetToDbModel,
  getPetsModel,
  getPetById,
  updatePetStatus,
} = require("../models/petsModels");
const { validateBody, validateQuery } = require("../middleware/petsMiddleware");
const { petsSchema, querySchema } = require("../schemas/petsSchema");
router.use(express.json());
router.use(cors());

router.post("/", validateBody(petsSchema), (req, res) => {
  try {
    const added = addPetToDbModel(req.body);

    res.send(added);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

router.post("/adopt", async (req, res) => {
  try {
    const { petId, ownerId, type } = req.body;
    const pet = await updatePetStatus(petId, ownerId, type);
    console.log(pet);

    res.send(type);
  } catch (error) {
    res.status(500).send(error);
  }
});
// ?status&type&height&weight&name
router.get("/", validateQuery(querySchema), async (req, res) => {
  try {
    const querys = req.query;

    const data = await getPetsModel(querys);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await getPetById(id);
    res.send(pet);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
