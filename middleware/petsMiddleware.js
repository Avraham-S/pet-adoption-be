const Ajv = require("ajv");
const ajv = new Ajv();
const jwt = require("jsonwebtoken");
const dbConnection = require("../knex/knex");

const validateBody = (schema) => (req, res, next) => {
  const isValid = ajv.validate(schema, req.body);
  if (!isValid) {
    res.status(400).send(ajv.errors[0].message);
    return;
  }

  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const isValid = ajv.validate(schema, req.query);
  if (!isValid) {
    res.status(400).send(ajv.errors[0].message);
    return;
  }

  next();
};

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send("Missing token");
    return;
  }

  const token = req.headers.authorization.split(" ")[1].replaceAll('"', "");

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.error(err);

      res.status(401).send("Invalid token");
      return;
    }
    if (decoded) {
      // req.body.userId = decoded.id;
      next();
    }
  });
};

const verifyAdminToken = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send("Missing token");
    return;
  }

  const token = req.headers.authorization.split(" ")[1].replaceAll('"', "");

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.error(err);

      res.status(401).send("Invalid token");
      return;
    }
    if (decoded) {
      if (!decoded.isAdmin) {
        res.status(401).send("Must be admin");
      }
      next();
    }
  });
};

const isPetSaved = async (req, res, next) => {
  try {
    const { ownerId, petId } = req.params;

    const pet = await dbConnection
      .from("saved_pets")
      .where({ userId: ownerId, petId });
    console.log("pet:", pet);

    if (pet.length) throw new Error("pet is already saved");
    next();
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  validateBody,
  validateQuery,
  verifyToken,
  isPetSaved,
  verifyAdminToken,
};
