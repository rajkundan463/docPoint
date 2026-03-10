const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const doctorController = require("../controllers/doctorController");

router.post(
    "/get-doctor-info-by-user-id",
    authMiddleware,
    doctorController.getDoctorInfoByUserId
);

router.post(
    "/get-doctor-info-by-id",
    authMiddleware,
    doctorController.getDoctorInfoById
);

router.post(
    "/update-doctor-profile",
    authMiddleware,
    doctorController.updateDoctorProfile
);

router.get(
    "/get-appointments-by-doctor-id",
    authMiddleware,
    doctorController.getAppointmentsByDoctorId
);

router.post(
    "/change-appointment-status",
    authMiddleware,
    doctorController.changeAppointmentStatus
);

router.post(
    "/delete-outdated-appointments",
    authMiddleware,
    doctorController.deleteOutdatedAppointments
);

module.exports = router;