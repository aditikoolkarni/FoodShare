const { User } = require('../models/user.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";
const oneDay = 1000 * 60 * 60 * 24;

/**
 * @function register
 * @description Registers a new user by hashing the password and saving user details to the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing user details.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.email - The email of the new user.
 * @param {string} req.body.password - The plain text password of the new user.
 *
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response with status and message.
 * - 201: User successfully registered.
 * - 500: Error during registration (e.g., duplicate email, DB failure).
 *
 * @example
 * // Request body
 * {
 *   "username": "john_doe",
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 */
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hash });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

/**
 * Logs in a user by verifying email and password, then issues a JWT token.
 * The token is sent in an HTTP-only cookie.
 *
 * @async
 * @function login
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.password - The user's plain text password.
 * @param {Object} res - Express response object.
 * 
 * @returns {Promise<void>} Sends a response with status 200 and a success message with user info on success.
 * If credentials are invalid or an error occurs, sends appropriate error status and message.
 *
 * @throws {Error} If JWT_SECRET is not set in the environment variables.
 * 
 * @example
 * // Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword123"
 * }
 * 
 * // Successful response:
 * {
 *   "message": "Login successful",
 *   "user": {
 *     "username": "john_doe",
 *     "email": "user@example.com"
 *   }
 * }
 */

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not set in environment variables");
          }

        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd, // true in prod, false locally
            sameSite: isProd ? "None" : "Lax",
            maxAge: oneDay,
          });
        res.status(200).json({ message: "Login successful", user : {username: user.username, email: user.email} });

    }catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
}
module.exports = { register, login };
