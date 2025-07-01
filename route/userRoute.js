// it is page for end point of user registration and login which connects to the mongoDB database 
// using  mongoose and bcrypt for password hashing
// and express for routing

const express = require('express');
const router = express.Router();
const user = require('../model/userModel');
const bcrypt = require('bcryptjs');

// Route for user registration
router.post('/register', async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await user.findOne({ email: req.body.email });
        if (existingUser) { 
             return res.status(400).send({ message: 'User already exists', success: false });
        }
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password !== confirmPassword) {
            return res.status(400).send({ message: 'Passwords do not match', success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        delete req.body.confirmPassword; // Do not store confirmPassword

        // Create a new user with complete details
        const newUser = new user(req.body);
        await newUser.save();
        res.status(200).send({ message: 'User registered successfully', success: true, user: newUser });

    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await user.findOne({ email });
        if (!foundUser) {
            return res.status(401).send({ message: 'Invalid credentials', success: false });
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials', success: false });
        }
        res.status(200).send({ message: 'Login successful', success: true, user: foundUser });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
});

module.exports = router;


