const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");


// GET DOCTOR INFO BY USER ID
exports.getDoctorInfoByUserId = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({ userId: req.body.userId });

    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error getting doctor info",
      success: false,
      error,
    });
  }
};



// GET DOCTOR INFO BY DOCTOR ID
exports.getDoctorInfoById = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({ _id: req.body.doctorId });

    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error getting doctor info",
      success: false,
      error,
    });
  }
};



// UPDATE DOCTOR PROFILE
exports.updateDoctorProfile = async (req, res) => {
  try {

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error updating doctor profile",
      success: false,
      error,
    });
  }
};



// GET APPOINTMENTS BY DOCTOR ID
exports.getAppointmentsByDoctorId = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({ userId: req.body.userId });

    const appointments = await Appointment.find({
      doctorId: doctor._id,
    });

    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
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

    const user = await User.findOne({ _id: appointment.userId });

    user.unseenNotifications.push({
      type: "appointment-status-changed",
      message: `Your appointment status has been ${status}`,
      onClickPath: "/appointments",
    });

    await user.save();

    res.status(200).send({
      message: "Appointment status changed successfully",
      success: true,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error changing appointment status",
      success: false,
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
    res.status(500).send({
      success: false,
      message: "Error deleting outdated appointments",
      error,
    });
  }
};