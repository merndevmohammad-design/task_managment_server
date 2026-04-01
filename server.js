const express = require("express");
require('dotenv').config();
const app = express();
const connectDb = require('./utils/db');

app.get("/", (req, res) => {
  res.status(200).send("starting the new task managment project ");
});

connectDb().then(() => {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
  });
});