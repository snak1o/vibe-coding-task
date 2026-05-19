const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

//route for user registration, handles new user with a hashed password
//Endpoint is POST /api/auth/register
router.post("/register", authController.register);

// route for login 
router.post("/login", authController.login);

module.exports = router;