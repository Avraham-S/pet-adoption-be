const dbConnection = require("../knex/knex");

const queryBuilder = (queryObj) => {
  const queryString = Object.entries(queryObj)
    .map((entry) => {
      if (entry[1] === "any") return "";
      return (
        entry[0] +
        `${entry[0] === "height" || entry[0] === "weight" ? " >= " : " = "}` +
        `'${entry[1]}'`
      );
    })
    .join(" AND ");

  const final = `${queryString.length ? "HAVING" : ""} ` + queryString;
  console.log(final);

  return final;
};

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
async function getPetsModel(userId, query) {
  const hasQuery = !!Object.entries(query).length;
  if (hasQuery) queryBuilder(query);
  console.log(userId);

  try {
    if (userId) {
      const [petsWithSaves] = await dbConnection.raw(
        `SELECT pets.*, saved_pets.userId FROM pets LEFT JOIN saved_pets ON pets.petId = saved_pets.petId  AND saved_pets.userId = '${userId}' GROUP BY pets.petId ${
          hasQuery ? queryBuilder(query) : ""
        };`
      );
      return petsWithSaves;
    }
    const pets = await dbConnection.from("pets");
    return pets;
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function getPetById(id) {
  try {
    const pet = await dbConnection.from("pets").where({ petId: id });
    return pet;
  } catch (error) {
    console.error(error);
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

    await dbConnection
      .from("pets")
      .where({ petId })
      .update({
        ownerId: type !== "return" ? ownerId : null,
        adoptionStatus: updateTo,
      });

    const pet = await dbConnection.from("pets").where({ petId });
    return pet;
  } catch (error) {
    console.error(error);
    return error;
  }
}
// TODO
async function getPetsByOwnerId(ownerId) {
  try {
    const pets = await dbConnection
      .select("pets.*", "saved_pets.userId")
      .from("pets")
      .leftJoin("saved_pets", function () {
        this.on("pets.petId", "saved_pets.petId").andOn(
          "saved_pets.userId",
          "pets.ownerId"
        );
      })
      .where("pets.ownerId", ownerId)
      .groupBy("pets.petId");
    return pets;
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function updatePetModel(id, data) {
  try {
    if (!data.picture) delete data.picture;
    delete data.created_at;
    console.log(data);

    const res = await dbConnection
      .from("pets")
      .where({ petId: id })
      .update(data);

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function savePetModel(userId, petId) {
  try {
    const response = await dbConnection
      .from("saved_pets")
      .insert({ userId, petId });
    console.log("response:", response);

    const connection = await dbConnection.from("saved_pets").where({ userId });
    console.log("connection:", connection);

    return connection;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
}

async function unsavePetModel(userId, petId) {
  try {
    await dbConnection.from("saved_pets").where({ userId, petId }).del();
    console.log("delete");
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function getSavedPetsModel(userId) {
  try {
    const list = await dbConnection
      .from("pets")
      .join("saved_pets", "pets.petId", "saved_pets.petId")
      .where("saved_pets.userId", userId);

    return list;
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function getPetTypesModel() {
  try {
    const types = await dbConnection
      .from("pets")
      .select("type")
      .groupBy("type");

    return types;
  } catch (error) {
    console.error(error);
    return error;
  }
}
module.exports = {
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
};
