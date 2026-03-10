const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const doctorRoutes = require("./doctorRoutes");

module.exports = (app) => {
  app.use("/api/user", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/doctor", doctorRoutes);

};