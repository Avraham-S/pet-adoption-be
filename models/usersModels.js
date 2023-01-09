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
    const user = await dbConnection.from("users").where({ email: email });
    console.log("user:", user);
    return user;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { addUserToDbModel, getUserByEmailModel };

/*
repassword:"schochet0205",
email:"ayschochet@gmail.com",
firstName:"Avraham",
lastName:"Schochet",
password:"schochet0205",
phone:"323232323232",

*/
