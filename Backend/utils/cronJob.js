const cron = require('node-cron');
const { Post } = require('../models/post.model');
const { Status } = require('../models/status.model');
const { sendClaimApprovalEmail } = require('./sendMail');

const expirePostsJob = () => {
  cron.schedule('*/10 * * * *', async () => {
    console.log('Running scheduled job to expire posts...');

    try {
      const now = new Date();

      // Find posts whose expiry_date has passed
      const expiredPosts = await Post.find({ expiry_date: { $lte: now } });

      for (const post of expiredPosts) {
        // Update corresponding status document
        await Status.findOneAndUpdate(
          { post_id: post._id },
          { status: 'expired' }
        );

        await sendClaimApprovalEmails(
          post.user_id,
          'Post Expired',
          `Your post with ID ${post._id} has expired.`
        );
      }

      console.log(`Checked ${expiredPosts.length} posts for expiration.`);
    } catch (error) {
      console.error('Error running expire post job:', error);
    }
  });
};

module.exports = {expirePostsJob};
