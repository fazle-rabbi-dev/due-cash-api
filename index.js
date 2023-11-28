#!/bin/node
const app = require('./app');
const PORT = process.env.PORT || 5000;
const chalk = require('chalk');

app.listen(PORT, ()=>{
   console.log(chalk.yellow('[*] Server is running at \n> http://localhost:'+PORT));
});
	
module.exports = app