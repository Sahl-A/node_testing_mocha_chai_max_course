const express = require("express");

// Get the validation methods
const { body } = require("express-validator");
// Get the user to check email existance
const User = require("../models/user");

const authControllers = require("../controllers/auth");

const router = express.Router();

// PUT /signup
router.put(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email")
      .custom(async (value) => {
        // Check if the email exists in DB
        const user = await User.findOne({ email: value });
        if (user) {
          return new Error("E-mail already in use");
        }
        return true;
      }),
    body("password", "Password should be more than 5 characters")
      .trim()
      .isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authControllers.signup
);

router.post("/login", authControllers.login);

module.exports = router;
