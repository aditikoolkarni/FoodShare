const mongoose = require('mongoose');

/**
 * Claim Schema
 *
 * Represents a user's claim on a post (donation/request), including the pickup details and mutual ratings.
 *
 * Fields:
 * - post_id: Reference to the claimed post (required).
 * - claimer_id: Reference to the user who made the claim (required).
 * - status: Status of the claim request - one of 'pending', 'approved', or 'rejected' (default: 'pending').
 * - pickup_date: date/time item was picked up (required).
 * - rating_by_claimer: Optional rating (1-5) given by the claimer to the post owner.
 * - rating_by_postowner: Optional rating (1-5) given by the post owner to the claimer.
 * - createdAt / updatedAt: Auto-generated timestamps.
 *
 * @typedef {Object} Claim
 * @property {mongoose.Types.ObjectId} post_id - Reference to the associated Post.
 * @property {mongoose.Types.ObjectId} claimer_id - User who claims the post.
 * @property {'pending'|'approved'|'rejected'} status - Status of the claim.
 * @property {Date} pickup_date - date/time of pickup.
 * @property {number} [rating_by_claimer] - Rating (1–5) by claimer.
 * @property {number} [rating_by_postowner] - Rating (1–5) by post owner.
 * @property {Date} createdAt - Timestamp of claim creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */

const claim_schema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  claimer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  pickup_date: {
    type: Date,
    required: true
  },
  rating_by_claimer: {
    type: Number,
    min: 1,
    max: 5
  },
  rating_by_postowner: {
    type: Number,
    min: 1,
    max: 5
  },
}, { timestamps: true });

/**
 * Mongoose model for the Claim schema.
 */
const Claim = mongoose.model('Claim', claim_schema);

module.exports = { Claim };
