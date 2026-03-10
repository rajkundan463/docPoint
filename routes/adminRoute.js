const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");


router.get(
  "/get-all-doctors",
  authMiddleware,
  adminController.getAllDoctors
);

router.get(
  "/get-all-users",
  authMiddleware,
  adminController.getAllUsers
);

router.post(
  "/change-doctor-account-status",
  authMiddleware,
  adminController.changeDoctorAccountStatus
);

router.post(
  "/change-user-status",
  authMiddleware,
  adminController.changeUserStatus
);

router.post(
  "/clear-blocked-doctors",
  adminController.clearBlockedDoctors
);

router.post(
  "/clear-blocked-users",
  adminController.clearBlockedUsers
);

module.exports = router;