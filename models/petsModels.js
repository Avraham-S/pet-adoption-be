const fs = require("fs");
const path = require("path");

function addPetToDbModel(newPet) {
  try {
    const db = fs.readFileSync(path.resolve(__dirname, "../db.json"));
    const parsed = JSON.parse(db);
    parsed.push(newPet);
    fs.writeFileSync(
      path.resolve(__dirname, "../db.json"),
      JSON.stringify(parsed)
    );
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

module.exports = { addPetToDbModel, getPetsModel };
