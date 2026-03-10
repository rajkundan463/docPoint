const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.post(
  "/get-user-info-by-id",
  authMiddleware,
  userController.getUserInfo
);

router.post(
  "/update-user-profile",
  authMiddleware,
  userController.updateUserProfile
);

router.post(
  "/apply-doctor-account",
  authMiddleware,
  userController.applyDoctorAccount
);

router.post(
  "/book-appointment",
  authMiddleware,
  userController.bookAppointment
);

module.exports = router;