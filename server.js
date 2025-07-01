const express = require('express');
const app = express();
require('dotenv').config()
const connect = require('./config/dbconfig');


// api for user registration and login  
app.use(express.json());   // use for decoding JSON data from requests like login and registration api calls
const userRoute = require('./route/userRoute'); // fetch route deatil for userRoute & connect to the database
app.use('/api/user', userRoute);



// Connect to MongoDB
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});