const Ajv = require("ajv");
const ajv = new Ajv();

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

module.exports = { validateBody, validateQuery };
