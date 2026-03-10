const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("starting the new task managment project ");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});