const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config()
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const userRoute = require("./routes/userRoutes");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorRoute");

app.use('/api/user', userRoute);
app.use('/api/admin',adminRoute);
app.use('/api/doctor',doctorRoute);
const __dirname1 = path.resolve(); 

// for deployment
app.use(express.static(path.join(__dirname1, './build')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname1, './build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Node Server Started at port ${port}`));