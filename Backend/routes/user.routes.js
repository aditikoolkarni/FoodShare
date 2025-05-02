const express = require('express');
const { register, login } = require('../controllers/user.controller');
const { userValidation, loginValidation } = require('../middleware/userValidation');

const user_router = express.Router();

/**
 * @module Routes/User
 * @description Defines user authentication routes including registration and login.
 */

/**
 * @route POST /register
 * @group User - Operations related to user authentication
 * @summary Register a new user
 * @param {string} username.body.required - Username of the user
 * @param {string} email.body.required - Email address of the user
 * @param {string} password.body.required - Password for the account
 * @returns {object} 201 - User registered successfully
 * @returns {object} 400 - Validation error
 * @returns {object} 500 - Internal server error
 */
user_router.post("/register", userValidation, register);

/**
 * @route POST /login
 * @group User - Operations related to user authentication
 * @summary Authenticate user and return a session token
 * @param {string} email.body.required - Registered email address
 * @param {string} password.body.required - Account password
 * @returns {object} 200 - Login successful with cookie
 * @returns {object} 400 - Validation error
 * @returns {object} 401 - Invalid credentials
 * @returns {object} 404 - User not found
 * @returns {object} 500 - Internal server error
 */
user_router.post("/login", loginValidation, login);

module.exports = { user_router };
