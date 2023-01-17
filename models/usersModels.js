const dbConnection = require("../knex/knex");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const addUserToDbModel = async (data) => {
  try {
    const uid = crypto.randomUUID();
    const { firstName, lastName, email, password, phone } = data;

    const [id] = await dbConnection.from("users").insert({
      firstName,
      lastName,
      email,
      password,
      phone,
      id: uid,
    });
    return id;
  } catch (err) {
    console.error(err);
  }
};

async function getUserByEmailModel(email) {
  try {
    const [user] = await dbConnection.from("users").where({ email: email });

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getAllUsersModel() {
  try {
    const users = await dbConnection.from("users");
    return users;
  } catch (error) {
    console.error(error);
  }
}

async function changeAdminStatusModel(id) {
  try {
    const [user] = await dbConnection.from("users").where({ id });

    await dbConnection
      .from("users")
      .where({ id })
      .update({ isAdmin: user.isAdmin ? 0 : 1 });
    return await dbConnection.from("users").where({ id });
  } catch (error) {
    console.error(error);
  }
}

async function getUserById(id) {
  try {
    const [user] = await dbConnection.from("users").where({ id });
    return user;
  } catch (error) {
    return error;
  }
}

async function updateUserModel(id, newData) {
  try {
    const { firstName, lastName, email, phone, bio } = newData;

    await dbConnection
      .from("users")
      .where({ id })
      .update({ firstName, lastName, email, phone, bio });

    const user = dbConnection.from("users").where({ id });

    return user;
  } catch (error) {
    return error;
  }
}

async function updateUserModelPassword(id, newData) {
  try {
    const { firstName, lastName, email, phone, bio, password } = newData;

    await dbConnection
      .from("users")
      .where({ id })
      .update({ firstName, lastName, email, phone, bio, password });

    const user = dbConnection.from("users").where({ id });
    return user;
  } catch (error) {
    return error;
  }
}

module.exports = {
  addUserToDbModel,
  getUserByEmailModel,
  getAllUsersModel,
  changeAdminStatusModel,
  getUserById,
  updateUserModel,
  updateUserModelPassword,
};

/*
repassword:"schochet0205",
email:"ayschochet@gmail.com",
firstName:"Avraham",
lastName:"Schochet",
password:"schochet0205",
phone:"323232323232",

*/
