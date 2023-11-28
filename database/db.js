const url = process.env.DB_URI;
const mongoose = require('mongoose') 

const chalk = require('chalk');

const connectionParams = { 
	useNewUrlParser: true, 
	useUnifiedTopology: true
} 

mongoose.connect(url,connectionParams) 
.then( () => { 
	console.log(chalk.green('[*] Connected to mongodb successfull…!'));
}) 
.catch( (err) => { 
   console.error(err);
});	
