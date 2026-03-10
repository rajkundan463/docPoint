require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/dbconfig");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Request logger
app.use(morgan("dev"));

// Routes
const userRoute = require("./routes/userRoutes");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorRoute");

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);

// REACT BUILD 
const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname1, "client/build", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});


const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.log("Database connection failed:", err.message);
  });