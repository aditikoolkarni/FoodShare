const mongoose = require('mongoose');

/**
 * @typedef {Object} Coordinates
 * @property {number} lat - Latitude coordinate.
 * @property {number} long - Longitude coordinate.
 */

/**
 * @typedef {Object} PickupLocation
 * @property {string} [address] - Human-readable address of the pickup location.
 * @property {Coordinates} [coordinates] - Geographical coordinates of the location.
 *
 * At least one of `address` or `coordinates` (with both `lat` and `long`) must be present.
 */
const pickupLocationSchema = new mongoose.Schema({
  address: {
    type: String
  },
  coordinates: {
    lat: Number,
    long: Number
  }
}, { _id: false });

// Custom validation: ensure at least address or valid coordinates are present
pickupLocationSchema.pre('validate', function (next) {
  const hasAddress = !!this.address;
  const hasCoordinates = this.coordinates &&
                         typeof this.coordinates.lat === 'number' &&
                         typeof this.coordinates.long === 'number';

  if (!hasAddress && !hasCoordinates) {
    next(new Error('Either address or coordinates (with both lat and long) must be provided.'));
  } else if (this.coordinates && (!hasCoordinates)) {
    next(new Error('Both lat and long must be provided in coordinates if coordinates is used.'));
  } else {
    next();
  }
});

/**
 * Post Schema
 *
 * Represents a user's donation or request post.
 *
 * Fields:
 * - user_id: Reference to the User who created the post (required).
 * - type: Indicates whether the post is a 'donate' or 'request' (required).
 * - description: Description of the items being donated or requested (required).
 * - quantity: Quantity of the item(s) (required).
 * - pickup_location: Pickup location details (object with address and/or coordinates) (required).
 * - expiry_date: Date after which the post expires (required).
 * - createdAt / updatedAt: Auto-generated timestamps.
 *
 * @typedef {Object} Post
 * @property {mongoose.Types.ObjectId} user_id - Reference to the User who made the post.
 * @property {'donate'|'request'} type - Type of post.
 * @property {string} description - Description of the item(s).
 * @property {string} quantity - Quantity of the item(s).
 * @property {PickupLocation} pickup_location - Pickup location info.
 * @property {Date} expiry_date - Expiry date of the post.
 * @property {Date} createdAt - Auto-generated creation time.
 * @property {Date} updatedAt - Auto-generated update time.
 */

const post_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['donate', 'request'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  pickup_location: {
    type: pickupLocationSchema,
    required: true
  },
  expiry_date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

/**
 * Mongoose model for the Post schema.
 */
const Post = mongoose.model('Post', post_schema);

module.exports = { Post };
