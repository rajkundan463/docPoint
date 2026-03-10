const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URL);
    console.log(" MongoDB connected successfully");

  } catch (error) {

    console.error(" MongoDB connection failed");
    console.error(error.message);

    throw error; 
  }
};
module.exports = connectDB;