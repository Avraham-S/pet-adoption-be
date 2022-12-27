require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const petsRoute = require("./routes/petsRoute");
const usersRoute = require("./routes/usersRoute");

const app = express();

app.use("/pets", petsRoute);
app.use("/users", usersRoute);
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is listneing on port ${PORT}`);
  console.log("Press Ctrl+C to stop");
});
