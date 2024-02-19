const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

router.post(
  "/",
  [
    check("email", "Email is not valid").isEmail(),
    check("password", "Enter the password").not().isEmpty(),
  ],
  authController.authenticateUSer
);

router.get("/", auth, authController.authenticatedUser);

module.exports = router;
