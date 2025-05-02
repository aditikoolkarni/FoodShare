const mongoose = require('mongoose');

/**
 * User Schema
 *
 * Represents an application user with login credentials and profile statistics.
 *
 * Fields:
 * - username: The user's display name (required).
 * - email: The user's unique email address (required, unique).
 * - password: The user's hashed password (required).
 * - total_donation_made: Total number of donations made by the user (default: 0).
 * - total_requests_fulfilled: Total number of other users' requests fulfilled (default: 0).
 * - rating: User’s average rating (default: 0).
 * - createdAt / updatedAt: Automatically managed by Mongoose (via timestamps).
 *
 * @typedef {Object} User
 * @property {string} username - The user's name.
 * @property {string} email - The user's email address (unique).
 * @property {string} password - Hashed password.
 * @property {number} total_donation_made - Number of donations the user made.
 * @property {number} total_requests_fulfilled - Number of fulfilled requests.
 * @property {number} rating - User's rating.
 * @property {Date} createdAt - Auto-generated timestamp of creation.
 * @property {Date} updatedAt - Auto-generated timestamp of last update.
 */

const user_schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    total_donation_made: {
        type: Number,
        default: 0
    },
    total_requests_fulfilled: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

/**
 * Mongoose model for the User schema.
 */
const User = mongoose.model('User', user_schema);

module.exports = { User };
