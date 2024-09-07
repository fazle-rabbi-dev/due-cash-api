#!/bin/node
const app = require("./app");
const PORT = process.env.PORT || 5000;
const chalk = require("chalk");
const { connect } = require("./utils/index.js");

connect();

const startServer = async () => {
  // const status = await connect();
  app.listen(PORT, () => {
    console.log(
      chalk.yellow("[*] Server is running at \n> http://localhost:" + PORT)
    );
  });
};

startServer();

module.exports = app;
