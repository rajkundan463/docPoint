require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/dbconfig");

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Logger
app.use(morgan("dev"));


// Health check route 
app.get("/", (req, res) => {
  res.send("DocPoint API Running 🚀");
});


// Routes
const registerRoutes = require("./routes/Index");
registerRoutes(app);


// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});


// PORT
const PORT = process.env.PORT || 5000;


// Connect DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err.message);
  });
