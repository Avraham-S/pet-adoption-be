require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const petsRoute = require("./routes/petsRoute");
const usersRoute = require("./routes/usersRoute");
const dbConnection = require("./knex/knex");
const mysql = require("mysql");
const app = express();

app.use("/pets", petsRoute);
app.use("/users", usersRoute);
app.use(cors());
app.use(express.json());

dbConnection.migrate
  .latest()
  .then((migration) => {
    if (migration) {
      console.log("connected to DB", migration);
      app.listen(PORT, () => {
        console.log(`Server is listneing on port ${PORT}`);
        console.log("Press Ctrl+C to stop");
      });
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
// });

// con.connect(function (err) {
//   try {
//     if (err) throw err;
//     console.log("Connected!");
//   } catch (error) {
//     console.error(error);
//   }
// });
