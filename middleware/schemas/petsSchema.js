const petsSchema = {
  type: "object",
  properties: {
    type: { type: "string" },
    name: { type: "string" },
    adoptionStatus: { type: "string" },
    picture: { type: "string" },
    height: { type: "number" },
    weight: { type: "number" },
    color: { type: "string" },
    bio: { type: "string" },
    hypoallergenic: { type: "boolean" },
    dietaryRestrictions: { type: "array" },
    Breed: { type: "string" },
  },
  additionalProperties: false,
};

const querySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    type: { type: "string" },
    status: { type: "string" },
    height: { type: "string" },
    weight: { type: "string" },
  },
  additionalProperties: false,
};

module.exports = { petsSchema, querySchema };
