const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");


// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(200).send({
        message: "User already exists",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    await newUser.save();

    res.status(200).send({
      message: "User created successfully",
      success: true,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error registering user",
      success: false,
      error,
    });
  }
};


// LOGIN USER
exports.loginUser = async (req, res) => {
  try {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(200).send({
        message: "User does not exist",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isMatch) {
      return res.status(200).send({
        message: "Password is incorrect",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      message: "Login successful",
      success: true,
      data: token,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error logging in",
      success: false,
      error,
    });
  }
};


// GET USER INFO
exports.getUserInfo = async (req, res) => {
  try {

    const user = await User.findOne({ _id: req.body.userId });

    if (!user) {
      return res.status(200).send({
        message: "User does not exist",
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).send({
      success: true,
      data: user,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error getting user info",
      success: false,
      error,
    });
  }
};


// UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
  try {

    const updateData = {
      name: req.body.userName,
      email: req.body.userEmail,
    };

    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).send({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error updating user profile",
      success: false,
      error,
    });
  }
};


// APPLY DOCTOR ACCOUNT
exports.applyDoctorAccount = async (req, res) => {
  try {

    const newDoctor = new Doctor({
      ...req.body,
      status: "pending",
    });

    await newDoctor.save();

    const adminUser = await User.findOne({ isAdmin: true });

    const unseenNotifications = adminUser.unseenNotifications;

    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onClickPath: "/admin/doctorslist",
    });

    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });

    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully",
    });

  } catch (error) {
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
};


// MARK NOTIFICATIONS AS SEEN
exports.markAllNotificationsAsSeen = async (req, res) => {
  try {

    const user = await User.findOne({ _id: req.body.userId });

    const unseenNotifications = user.unseenNotifications;

    user.seenNotifications = unseenNotifications;
    user.unseenNotifications = [];

    const updatedUser = await User.findByIdAndUpdate(user._id, user);

    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error marking notifications",
      success: false,
      error,
    });
  }
};


// DELETE ALL NOTIFICATIONS
exports.deleteAllNotifications = async (req, res) => {
  try {

    const user = await User.findOne({ _id: req.body.userId });

    user.seenNotifications = [];
    user.unseenNotifications = [];

    const updatedUser = await user.save();

    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: updatedUser,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error deleting notifications",
      success: false,
      error,
    });
  }
};


// GET APPROVED DOCTORS
exports.getAllApprovedDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find({ status: "approved" });

    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error fetching doctors",
      success: false,
      error,
    });
  }
};


// BOOK APPOINTMENT
exports.bookAppointment = async (req, res) => {
  try {

    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();

    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    const user = await User.findOne({
      _id: req.body.doctorInfo.userId,
    });

    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });

    await user.save();

    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
};


// CHECK BOOKING AVAILABILITY
exports.checkBookingAvailability = async (req, res) => {
  try {

    const { date: dateString, time: timeString, doctorId } = req.body;

    const date = moment(dateString, "DD-MM-YYYY");
    const now = moment();

    if (date.isBefore(now, "day")) {
      return res.status(200).send({
        message: "Date cannot be in the past",
        success: false,
      });
    }

    const time = moment(timeString, "HH:mm");

    const fromTime = time.clone().subtract(1, "hours");
    const toTime = time.clone().add(1, "hours");

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(200).send({
        message: "Doctor not found",
        success: false,
      });
    }

    const workStartTime = moment(doctor.timings[0], "HH:mm");
    const workEndTime = moment(doctor.timings[1], "HH:mm");

    if (!time.isBetween(workStartTime, workEndTime, null, "[]")) {
      return res.status(200).send({
        message: "Chosen time is outside doctor's working hours",
        success: false,
      });
    }

    const appointments = await Appointment.find({
      doctorId,
      date: date.toISOString(),
      time: {
        $gte: fromTime.toISOString(),
        $lte: toTime.toISOString(),
      },
      status: "approved",
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointment not available",
        success: false,
      });
    }

    res.status(200).send({
      message: "Appointment available",
      success: true,
    });

  } catch (error) {
    res.status(500).send({
      message: "Error checking availability",
      success: false,
      error,
    });
  }
};


// GET USER APPOINTMENTS
exports.getAppointmentsByUserId = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      userId: req.body.userId,
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