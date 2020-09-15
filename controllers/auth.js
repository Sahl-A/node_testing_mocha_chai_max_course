// Hash the password
const bcrypt = require("bcrypt");
// Get the validation result
const { validationResult } = require("express-validator");
// Generate the JWT token
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// When clicking on signup button
exports.signup = async (req, res, next) => {
  // Check the validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(`Validation failed: ${errors.array()}`);
    error.statusCode = 422;
    return next(error);
  }

  // Get the data from body
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    // Encrypt the password
    const hash = await bcrypt.hash(password, 12);
    try {
      const newUser = new User({
        email,
        password: hash,
        name,
      });
      const user = await newUser.save();
      res.status(201).json({ message: "User Created", userId: user._id });
    } catch (err) {
      // ERR when Saving the user to DB
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } catch (err) {
    // ERR when encrypting the password
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// When clicking on login button
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email });
    // If there is no user with this email
    if (!user) {
      const error = new Error(`A user with this email could not be found`);
      error.statusCode = 401;
      return next(error);
    }
    try {
      const isPassEqual = await bcrypt.compare(password, user.password);
      // If the passwords do not match
      if (!isPassEqual) {
        const error = new Error(`Wrong Password`);
        error.statusCode = 401;
        return next(error);
      }
      // Generate the JWT token
      const token = jwt.sign(
        { email: user.email, userId: user._id },
        "SECRET KEY TO GENERATEE THE TOKEN<, SHOULD BE COMPLICATED",
        { expiresIn: "1h" }
      );
      // Send the token back
      res.status(200).json({
        token,
        userId: user._id,
      });
      return;
    } catch (err) {
      // ERR when comparing the password with the stored hash
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
      return err;
    }
  } catch (err) {
    // ERR when getting a user from DB
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
