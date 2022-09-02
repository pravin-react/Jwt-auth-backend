const express = require("express");
const dotEnv = require("dotenv");

const index = require("./index");

dotEnv.config();

let PORT = process.env.PORT || 5000;

index.listen(PORT, () => {
  console.log(`Server is Up and running on ${PORT}`);
});
