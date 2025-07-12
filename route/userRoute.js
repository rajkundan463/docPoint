// it is page for end point of user registration and login which connects to the mongoDB database 
// using  mongoose and bcrypt for password hashing
// and express for routing

const express = require('express');
const router = express.Router();
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const Doctor = require("../model/doctorModel")

// Route for user registration
router.post('/register', async(req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) { 
             return res.status(200).send({ message: "User already exists", success: false });
        }
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password !== confirmPassword) {
            return res.status(200).send({ message: "Passwords do not match", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        delete req.body.confirmPassword; // Do not store confirmPassword

        // Create a new user with complete details
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).send({ message: "User registered successfully", success: true});
    } catch (error) {
        console.error('Registration error:', error); // Handle any errors that occur during registration
        res.status(500).send({ message: 'Server error',success:false, error });
    }
});

// Route for user login
router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ email:req.body.email });
        if (!user) {
            return res.status(200).send({ message: 'No User Found', success: false });
        }
        // Check if the password matches
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: 'Wrong Password', success: false });
        } else {
            // Generate JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.status(200).send({ message: 'Login successful', success: true, data:token});
        }
    } catch (error) {
        console.error('Login error:', error); // Handle any errors that occur during login
        res.status(500).send({ message: 'Server error', error });
    }
});

// Route to get user info by ID  & authentication to home
router.post('/get-user-info-by-id', authMiddleware, async(req, res) => {

    try {
        const user = await User.findOne({ _id: req.body.userId});
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        }
        else{
            res.status(200).send({ success: true, 
                data: user
       
            });
        }

    } catch (error) {
        res.status(500).send({ message: 'user getting error auth', success: false, error });
    }
});

//Route to get doctor info & authentication to apply doctor..
router.post('/apply-doctor-account', authMiddleware , async (req, res) => {
    try {
        console.log(req.body.timings);
        const newdoctor = new Doctor({...req.body , status: "pending"});
        await newdoctor.save();
        const adminUser = await User.findOne({ isAdmin: true });

        const unseenNotifications = adminUser.unseenNotifications
        unseenNotifications.push({
            type: "new-doctor-request",
            message : `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId : newdoctor._id,
                name : newdoctor.firstName + " " + newdoctor.lastName 
            },
            onClickPath : "/admin/doctorslist"
        })
        await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
        console.log(res.status);
        res.status(200).send({
           
            success: true,
            message: "Doctor account applied successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500)
            .send({ message: "Error applying doctor account" , success: false, error });
    }
});


module.exports = router;


