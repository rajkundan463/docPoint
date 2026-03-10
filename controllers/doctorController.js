const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");


// GET DOCTOR INFO BY USER ID
exports.getDoctorInfoByUserId = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({ userId: req.userId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });

  } catch (error) {

    console.log("GetDoctorInfo Error:", error);

    res.status(500).send({
      success: false,
      message: "Error getting doctor info",
      error,
    });

  }
};



// GET DOCTOR INFO BY DOCTOR ID
exports.getDoctorInfoById = async (req, res) => {
  try {

    const doctor = await Doctor.findById(req.body.doctorId);

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });

  } catch (error) {

    console.log("GetDoctorById Error:", error);

    res.status(500).send({
      success: false,
      message: "Error getting doctor info",
      error,
    });

  }
};



// UPDATE DOCTOR PROFILE
exports.updateDoctorProfile = async (req, res) => {
  try {

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.userId },
      req.body,
      { new: true }
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });

  } catch (error) {

    console.log("UpdateDoctor Error:", error);

    res.status(500).send({
      success: false,
      message: "Error updating doctor profile",
      error,
    });

  }
};



// GET APPOINTMENTS BY DOCTOR ID
exports.getAppointmentsByDoctorId = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({ userId: req.userId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id,
    });

    res.status(200).send({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });

  } catch (error) {

    console.log("GetDoctorAppointments Error:", error);

    res.status(500).send({
      success: false,
      message: "Error fetching appointments",
      error,
    });

  }
};



// CHANGE APPOINTMENT STATUS
exports.changeAppointmentStatus = async (req, res) => {
  try {

    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    const user = await User.findById(appointment.userId);

    if (user) {

      user.unseenNotifications.push({
        type: "appointment-status-changed",
        message: `Your appointment status has been ${status}`,
        onClickPath: "/appointments",
      });

      await user.save();

    }

    res.status(200).send({
      success: true,
      message: "Appointment status changed successfully",
    });

  } catch (error) {

    console.log("ChangeAppointmentStatus Error:", error);

    res.status(500).send({
      success: false,
      message: "Error changing appointment status",
      error,
    });

  }
};



// DELETE OUTDATED APPOINTMENTS
exports.deleteOutdatedAppointments = async (req, res) => {
  try {

    const now = moment().toISOString();

    await Appointment.deleteMany({
      date: { $lt: now },
    });

    res.status(200).send({
      success: true,
      message: "Outdated appointments deleted successfully",
    });

  } catch (error) {

    console.log("DeleteAppointments Error:", error);

    res.status(500).send({
      success: false,
      message: "Error deleting outdated appointments",
      error,
    });

  }
};