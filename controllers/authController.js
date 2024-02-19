const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const { validationResult } = require("express-validator");

exports.authenticateUSer = async (req, res, next) => {
  // Show express validator error message
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Search for registered user
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ msg: "User doesn't exist" });
    return next();
  }

  // Check password and authenticate user
  if (bcrypt.compareSync(password, user.password)) {
    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.SECRET,
      {
        expiresIn: "8h",
      }
    );

    res.json({ token });
  } else {
    res.status(401).json({ msg: "Incorrect password" });
    return next();
  }
};

exports.authenticatedUser = (req, res, next) => {
  res.json({ user: req.user });
};
