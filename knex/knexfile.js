const path = require("path");

const pathToMigrations = path.resolve(__dirname, "../migrations");

module.exports = {
  client: "mysql",
  version: 8,
  connection: {
    host: "localhost",
    user: "root",
    password: "password",
    database: "pet_adoption",
  },
  pool: {
    min: 0,
    max: 7,
  },
  migrations: {
    tableNanme: "migrations",
    directory: pathToMigrations,
  },
};
