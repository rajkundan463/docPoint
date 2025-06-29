const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.mongo_url)

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Database connected successfully')});

db.on('error', (error) => {
  console.error('Connection error:', error)});
  
module.exports = connect;