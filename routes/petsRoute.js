const express = require("express");

const router = express.Router();
const cors = require("cors");

const {
  addPetToDbModel,
  getPetsModel,
  getPetById,
  updatePetStatus,
  getPetsByOwnerId,
  updatePetModel,
  savePetModel,
  unsavePetModel,
  getSavedPetsModel,
  getPetTypesModel,
} = require("../models/petsModels");
const {
  validateBody,
  validateQuery,
  verifyToken,
  isPetSaved,
  verifyAdminToken,
} = require("../middleware/petsMiddleware");
const { petsSchema, querySchema } = require("../schemas/petsSchema");

router.use(express.json());
router.use(cors());

router.post(
  "/",
  validateBody(petsSchema),
  verifyAdminToken,
  async (req, res) => {
    try {
      const added = await addPetToDbModel(req.body);

      res.send(added);
    } catch (error) {
      res.status(error.status || 500).send(error.message);
    }
  }
);

router.post("/adopt", verifyToken, async (req, res) => {
  try {
    const { petId, ownerId, type } = req.body;
    const pet = await updatePetStatus(petId, ownerId, type);
    res.send(pet);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const { id, queries } = req.query;

    const parsedQuery = JSON.parse(queries);

    const data = await getPetsModel(id, parsedQuery);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/types", async (req, res) => {
  try {
    const types = await getPetTypesModel();

    res.send(types);
  } catch (error) {
    res.status(500).send(error);
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

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pets = await getPetsByOwnerId(id);
    res.send(pets);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await updatePetModel(id, req.body);
    const pet = await getPetById(id);
    res.send(pet);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post(
  "/save/:ownerId/:petId",
  verifyToken,
  isPetSaved,
  async (req, res) => {
    try {
      const { ownerId, petId } = req.params;

      const response = await savePetModel(ownerId, petId);

      res.send(response);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.delete("/save/:ownerId/:petId", verifyToken, async (req, res) => {
  try {
    const { ownerId, petId } = req.params;

    const response = await unsavePetModel(ownerId, petId);
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/save/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const pets = await getSavedPetsModel(ownerId);
    res.send(pets);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
