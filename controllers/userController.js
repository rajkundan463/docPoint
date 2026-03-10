const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");


// REGISTER USER
exports.registerUser = async (req, res) => {
  try {

    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).send({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Error registering user",
      error
    });

  }
};



// LOGIN USER
exports.loginUser = async (req, res) => {
  try {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User does not exist"
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Password is incorrect"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      success: true,
      message: "Login successful",
      data: token
    });

  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Error logging in",
      error
    });

  }
};



// GET USER INFO
exports.getUserInfo = async (req, res) => {
  try {

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User does not exist"
      });
    }

    res.status(200).send({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Error getting user info",
      error
    });

  }
};



// UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        name: req.body.userName,
        email: req.body.userEmail
      },
      { new: true }
    ).select("-password");

    res.status(200).send({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser
    });

  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Error updating user profile",
      error
    });

  }
};



// APPLY DOCTOR ACCOUNT
exports.applyDoctorAccount = async (req, res) => {
  try {

    // parse timings safely
    let timings = [];

    if (req.body.timings) {
      timings = JSON.parse(req.body.timings);
    }

    const newDoctor = new Doctor({

      ...req.body,

      timings,

      profileImage: req.file ? req.file.path : "",

      status: "pending",

    });

    await newDoctor.save();

    // find admin
    const adminUser = await User.findOne({ isAdmin: true });

    if (adminUser) {

      const unseenNotifications = adminUser.unseenNotifications;

      unseenNotifications.push({
        type: "new-doctor-request",
        message: `${req.body.firstName} ${req.body.lastName} applied for a doctor account`,
        data: {
          doctorId: newDoctor._id,
          name: req.body.firstName + " " + req.body.lastName,
        },
        onClickPath: "/admin/doctorslist",
      });

      await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });

    }

    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully",
    });

  } catch (error) {

    console.log("Apply Doctor Error:", error);

    res.status(500).send({
      success: false,
      message: "Error applying doctor account",
      error,
    });

  }
};

// UPDATE DOCTOR PROFILE
exports.updateDoctorProfile = async (req, res) => {

  try {

    const timings = JSON.parse(req.body.timings);

    const updateData = {
      ...req.body,
      timings
    };

    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      updateData,
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error updating doctor profile"
    });

  }

};

// MARK ALL NOTIFICATIONS AS SEEN
exports.markAllNotificationsAsSeen = async (req, res) => {
  try {

    const user = await User.findById(req.userId);

    user.seenNotifications = [
      ...user.seenNotifications,
      ...user.unseenNotifications
    ];

    user.unseenNotifications = [];

    await user.save();

    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: user
    });

  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Error marking notifications",
      error
    });

  }
};



// DELETE ALL NOTIFICATIONS
exports.deleteAllNotifications = async (req, res) => {
  try {

    const user = await User.findById(req.userId);

    user.seenNotifications = [];
    user.unseenNotifications = [];

    await user.save();

    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: user
    });

  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Error deleting notifications",
      error
    });

  }
};



// GET APPROVED DOCTORS
exports.getAllApprovedDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find({ status: "approved" });

    res.status(200).send({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors
    });

  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Error fetching doctors",
      error
    });

  }
};



// BOOK APPOINTMENT
exports.bookAppointment = async (req, res) => {
  try {

    const { doctorId, doctorInfo, userInfo } = req.body;

    if (!doctorId) {
      return res.status(400).send({
        success: false,
        message: "Doctor ID is required"
      });
    }

    // convert date and time safely
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const time = moment(req.body.time, "HH:mm").toISOString();

    const newAppointment = new Appointment({
      ...req.body,
      date,
      time,
      status: "pending"
    });

    await newAppointment.save();

    // notify doctor
    const doctorUser = await User.findById(doctorInfo.userId);

    if (doctorUser) {

      doctorUser.unseenNotifications.push({
        type: "new-appointment-request",
        message: `A new appointment request from ${userInfo.name}`,
        onClickPath: "/doctor/appointments"
      });

      await doctorUser.save();

    }

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully"
    });

  } catch (error) {

    console.log("Book Appointment Error:", error);

    res.status(500).send({
      success: false,
      message: "Error booking appointment",
      error
    });

  }
};



// CHECK BOOKING AVAILABILITY
exports.checkBookingAvailability = async (req, res) => {
  try {

    const { date, time, doctorId } = req.body;

    const selectedDate = moment(date, "DD-MM-YYYY").toISOString();

    const selectedTime = moment(time, "HH:mm");

    const fromTime = selectedTime.clone().subtract(1, "hours").toISOString();
    const toTime = selectedTime.clone().add(1, "hours").toISOString();

    const appointments = await Appointment.find({
      doctorId,
      date: selectedDate,
      time: { $gte: fromTime, $lte: toTime },
      status: "approved"
    });

    if (appointments.length > 0) {
      return res.send({
        success: false,
        message: "Appointment not available"
      });
    }

    res.send({
      success: true,
      message: "Appointment available"
    });

  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Error checking availability",
      error
    });

  }
};



// GET USER APPOINTMENTS
exports.getAppointmentsByUserId = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      userId: req.userId
    });

    res.status(200).send({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments
    });

  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Error fetching appointments",
      error
    });

  }
};