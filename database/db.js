const url = process.env.DB_URI;
const mongoose = require('mongoose') 

const connectionParams = { 
	useNewUrlParser: true, 
	useUnifiedTopology: true
} 

const connect = async () => {
  try {
    const status = await mongoose.connect(url,connectionParams);
    console.log("Connected to db")
    return status;
  } catch (e) {
    return e.message;
  }
}

module.exports = connect;