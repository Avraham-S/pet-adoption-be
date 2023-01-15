const Ajv = require("ajv");
const ajv = new Ajv();
const jwt = require("jsonwebtoken");

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

  // console.log(token);

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.log(err);

      res.status(401).send("Invalid token");
      return;
    }
    if (decoded) {
      // req.body.userId = decoded.id;
      // console.log(decoded);

      next();
    }
  });
};

module.exports = { validateBody, validateQuery, verifyToken };
