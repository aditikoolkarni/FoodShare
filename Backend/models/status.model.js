const mongoose = require('mongoose');

/**
 * Status Schema
 *
 * Tracks the lifecycle status of a Post.
 *
 * Fields:
 * - post_id: Reference to the associated Post document (required).
 * - status: Current state of the post, limited to specific values:
 *   - 'posted': Post has been created.
 *   - 'claimed': Someone has shown interest in fulfilling the post.
 *   - 'picked_up': Items from the post have been picked up.
 *   - 'completed': The post request/donation is fully completed.
 *   - 'expired': The post has expired without fulfillment.
 * - createdAt / updatedAt: Automatically managed timestamps by Mongoose.
 *
 * @typedef {Object} Status
 * @property {mongoose.Types.ObjectId} post_id - Reference to the related Post.
 * @property {'posted'|'claimed'|'picked_up'|'completed'|'expired'} status - Current status of the post.
 * @property {Date} createdAt - Auto-generated creation timestamp.
 * @property {Date} updatedAt - Auto-generated update timestamp.
 */

const status_schema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    status: {
        type: String,
        enum: ['posted', 'claimed', 'picked_up', 'completed', 'expired'],
        default: 'posted'
    },
}, { timestamps: true });

/**
 * Mongoose model for the Status schema.
 */
const Status = mongoose.model('Status', status_schema);

module.exports = { Status };
