const fs = require("fs");
const path = require("path");
const dbConnection = require("../knex/knex");

async function addPetToDbModel(newPet) {
  try {
    const response = await dbConnection.insert(newPet);

    return true;
  } catch (error) {
    return false;
  }
}
// { name, height, weight, type, status }
function getPetsModel(querys) {
  try {
    const file = fs.readFileSync(path.resolve(__dirname, "../db.json"));
    const parsed = JSON.parse(file);
    let filtered = [...parsed];

    Object.keys(querys).forEach(
      (query) =>
        (filtered = filtered.filter((pet) => {
          return String(pet[query]) === String(querys[query]);
        }))
    );
    return filtered;
  } catch (error) {}
}

function getPetById(id) {
  try {
    const file = fs.readFileSync(path.resolve(__dirname, "../db.json"));
    const parsed = JSON.parse(file);

    const pet = parsed.find((pet) => pet.id === id);
    if (!pet) throw new Error("Cannot find pet");
    return pet;
  } catch (error) {
    return error;
  }
}

module.exports = { addPetToDbModel, getPetsModel, getPetById };
