const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");


// GET ALL DOCTORS
exports.getAllDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find({});

    res.status(200).send({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctors",
      error,
    });
  }
};


// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.find({});

    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error,
    });
  }
};


// CHANGE DOCTOR ACCOUNT STATUS
exports.changeDoctorAccountStatus = async (req, res) => {
  try {

    const { doctorId, status } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    );

    const user = await User.findOne({ _id: doctor.userId });

    user.unseenNotifications.push({
      type: "new-doctor-request-changed",
      message: `Your doctor account has been ${status}`,
      onClickPath: "/notifications",
    });

    user.isDoctor = status === "approved";

    await user.save();

    res.status(200).send({
      success: true,
      message: "Doctor status updated successfully",
      data: doctor,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating doctor status",
      error,
    });
  }
};


// CHANGE USER STATUS
exports.changeUserStatus = async (req, res) => {
  try {

    const { userId, status } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.status = status;

    await user.save();

    res.status(200).send({
      success: true,
      message: `User status updated to ${status}`,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating user status",
      error,
    });
  }
};


// CLEAR BLOCKED DOCTORS
exports.clearBlockedDoctors = async (req, res) => {
  try {

    const result = await Doctor.deleteMany({ status: "blocked" });

    if (result.deletedCount > 0) {
      return res.status(200).send({
        success: true,
        message: "Blocked doctors cleared successfully",
      });
    }

    res.status(200).send({
      success: false,
      message: "No blocked doctors found",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to clear blocked doctors",
      error,
    });
  }
};


// CLEAR BLOCKED USERS
exports.clearBlockedUsers = async (req, res) => {
  try {

    const result = await User.deleteMany({ status: "blocked" });

    if (result.deletedCount > 0) {
      return res.status(200).send({
        success: true,
        message: "Blocked users cleared successfully",
      });
    }

    res.status(200).send({
      success: false,
      message: "No blocked users found",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to clear blocked users",
      error,
    });
  }
};