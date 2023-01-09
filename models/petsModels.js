const fs = require("fs");
const { type } = require("os");
const path = require("path");
const dbConnection = require("../knex/knex");

async function addPetToDbModel(newPet) {
  try {
    console.log("db");
    console.log(newPet);

    const response = await dbConnection.from("pets").insert(newPet);
    console.log(response);
    console.log("res");

    return response;
  } catch (error) {
    console.error(error);
    return false;
  }
}
// { name, height, weight, type, status }
async function getPetsModel(querys) {
  try {
    const filtered = await dbConnection.from("pets");
    return filtered;
  } catch (error) {}
}

async function getPetById(id) {
  try {
    const pet = await dbConnection.from("pets").where({ petId: id });
    console.log(pet);

    return pet;
  } catch (error) {
    return error;
  }
}

async function updatePetStatus(petId, ownerId, type) {
  try {
    let updateTo;
    switch (type) {
      case "adopt":
        updateTo = "adopted";
        break;
      case "foster":
        updateTo = "fostered";
        break;
      case "return":
        updateTo = "available";
    }

    const pet = await dbConnection
      .from("pets")
      .where({ petId })
      .update({ ownerId, adoptionStatus: updateTo });
    return pet;
  } catch (error) {
    return error;
  }
}

module.exports = { addPetToDbModel, getPetsModel, getPetById, updatePetStatus };
