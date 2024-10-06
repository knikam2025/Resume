const User = require("../models/user");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

dotenv.config();

exports.register = async (req, res) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, username, password, contactNumber } = req.body;

    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User with that email or username already exists" });
    }

    const newUser = new User({ username, email, password, contactNumber });
    await newUser.save();

    //  JWT Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", 
    });


    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser._id, 
    });

  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

   
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id, 
    });

  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
