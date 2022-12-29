const dbConnection = require("../knex/knex");
const crypto = require("crypto");

const addUserToDbModel = async (data) => {
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
};

module.exports = { addUserToDbModel };

/*
repassword:"schochet0205",
email:"ayschochet@gmail.com",
firstName:"Avraham",
lastName:"Schochet",
password:"schochet0205",
phone:"323232323232",

*/
