const express = require("express");

const router = express.Router();
const cors = require("cors");
const { signupSchema } = require("../schemas/usersSchema");
const {
  addUserToDbModel,
  getAllUsersModel,
  changeAdminStatusModel,
  getUserById,
  updateUserModel,
  updateUserModelPassword,
} = require("../models/usersModels");
const {
  isNewEmail,
  passwordsMatch,
  hashPassword,
  verifyPassword,
  doesUserExist,
} = require("../middleware/usersMiddlesware");
const { validateBody, verifyToken } = require("../middleware/petsMiddleware");
const { verify } = require("crypto");

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
  isNewEmail,
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
      bio: user.bio,
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

router.put(
  "/updateUser/password/:id",
  verifyToken,
  passwordsMatch,
  isNewEmail,
  doesUserExist,
  verifyPassword,
  hashPassword,
  async (req, res) => {
    try {
      console.log("backend");
      const { id } = req.params;
      const user = await updateUserModelPassword(id, req.body);
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.put("/updateUser/:id", verifyToken, isNewEmail, async (req, res) => {
  try {
    console.log("backend ");
    const { id } = req.params;
    const user = await updateUserModel(id, req.body);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
