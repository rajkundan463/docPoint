const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");
const upload = require("../middlewares/cloudinaryUpload");



router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);



router.post("/get-user-info-by-id",
  authMiddleware,
  userController.getUserInfo
);

router.post( "/update-user-profile",
  authMiddleware,
  userController.updateUserProfile
);


router.post( "/apply-doctor-account",
  authMiddleware,
  upload.single("profileImage"),
  userController.applyDoctorAccount
);

router.post(  "/update-doctor-profile",
  authMiddleware,
  upload.single("profileImage"),
  userController.updateDoctorProfile
);



router.post("/mark-all-notifications-as-seen",
  authMiddleware,
  userController.markAllNotificationsAsSeen
);

router.post("/delete-all-notifications",
  authMiddleware,
  userController.deleteAllNotifications
);


router.get("/get-all-approved-doctors",
  authMiddleware,
  userController.getAllApprovedDoctors
);



router.post("/book-appointment",
  authMiddleware,
  userController.bookAppointment
);

router.post("/check-booking-availability",
  authMiddleware,
  userController.checkBookingAvailability
);

router.get("/get-appointments-by-user-id",
  authMiddleware,
  userController.getAppointmentsByUserId
);



module.exports = router;