const mongoose = require('mongoose');

/**
 * Notification Schema
 *
 * Represents a notification sent to a user, such as status updates or expiry alerts.
 *
 * Fields:
 * - content: The message content of the notification (required).
 * - user_id: Reference to the user who receives the notification (required).
 * - type: The type/category of the notification - either 'claim_status' or 'expire' (required).
 * - createdAt / updatedAt: Timestamps automatically managed by Mongoose.
 *
 * @typedef {Object} Notification
 * @property {string} content - Text content of the notification.
 * @property {mongoose.Types.ObjectId} user_id - User who receives the notification.
 * @property {'claim_status'|'expire'} type - Type of notification.
 * @property {Date} createdAt - Timestamp of creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */

const notification_schema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['claim_status', 'expire'],
    required: true
  }
}, { timestamps: true });

/**
 * Mongoose model for the Notification schema.
 */
const Notification = mongoose.model('Notification', notification_schema);

module.exports = { Notification };
