const express = require("express");

const router = express.Router();
const cors = require("cors");
const { signupSchema } = require("../schemas/usersSchema");
const {
  addUserToDbModel,
  getAllUsersModel,
  changeAdminStatusModel,
  getUserById,
} = require("../models/usersModels");
const {
  isNewUser,
  passwordsMatch,
  hashPassword,
  verifyPassword,
  doesUserExist,
} = require("../middleware/usersMiddlesware");
const { validateBody, verifyToken } = require("../middleware/petsMiddleware");

router.use(express.json());
router.use(cors());

router.post("/login", doesUserExist, verifyPassword, async (req, res) => {
  try {
    const { user, token } = req.body;
    res.send({
      name: user.firstName,
      id: user.id,
      token,
      isAdmin: !!user.isAdmin,
    });
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

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await getAllUsersModel();
    const filteredList = users.map((user) => {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        id: user.id,
      };
    });
    res.send(filteredList);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    const userInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    };
    res.send(userInfo);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/toggleAdmin", verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    const user = await changeAdminStatusModel(id);
    // const adminStatus = !!user.isAdmin;
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
