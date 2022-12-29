const knex = require("knex");
const knexfile = require("./knexfile");

const dbConnection = knex(knexfile);

module.exports = dbConnection;
