const { Claim } = require("../models/claim.model");
const { Post } = require("../models/post.model");
const statusController = require("./status.controller"); // Import the status controller

const create = async (req, res) => {
  const { post_id } = req.body;

  if (!post_id) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  try {
    const claim = new Claim({
      post_id,
      claimer_id: req.user_id,
    });
    await claim.save();
    return res
      .status(201)
      .json({ message: "Claim created successfully", claim });
  } catch (error) {
    return res.status(500).json({ message: "Error creating claim", error });
  }
};

const getClaimsByPostId = async (req, res) => {
  //should be seen by the post owner only
  const { post_id } = req.params;
  try {
    if (!post_id) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user_id.toString() !== req.user_id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view these claims" });
    }

    const claims = await Claim.find({ post_id }).populate(
      "claimer_id",
      "username total_donation_made total_requests_fulfilled rating"
    );
    if (!claims) {
      return res.status(404).json({ message: "No claims found for this post" });
    }
    return res.status(200).json(claims);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching claims", error });
  }
};

const updateClaimStatus = async (req, res) => {
  const { claim_id } = req.params;
  const { status } = req.body; // status can be 'approved' or 'rejected'

  try {
    const claim = await Claim.findById(claim_id).populate(
      "post_id",
      "user_id description"
    );
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.post_id.user_id.toString() !== req.user_id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this claim" });
    }

    claim.status = status;
    await claim.save();
    if (status === "approved") {
      const status = await statusController.update(
        claim.post_id._id,
        "claimed"
      ); // Update the status of the post

      await sendClaimApprovalEmail(
        claim.claimer_id,
        "Your claim is approved",
        `Congratulations your claim for ${claim.post_id.description}is approved!`
      ); // Send email to the claimer

      // Store notification
      await Notification.create({
        content: `Your claim for the post "${claim.post_id.description}" has been approved.`,
        user_id: claim.claimer_id,
        type: "claim_status",
      });

      if (!status) {
        return res.status(500).json({ message: "Error updating post status" });
      }
    }
    return res
      .status(200)
      .json({ message: "Claim status updated successfully", claim });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating claim status", error });
  }
};

const rating = async (req, res) => {
  const { claim_id } = req.params;
  const { rating } = req.body;
  const user_id = req.user_id;
  if (!claim_id) {
    return res.status(400).json({ message: "Claim ID is required" });
  }

  try {
    const claim = await Claim.findById(claim_id).populate(
      "post_id",
      "user_id type"
    );
    const statusObject = await statusController.getStatusByPostId(
      claim.post_id._id
    ); // Get the status of the post
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    if (statusObject.status !== "picked_up") {
      return res
        .status(403)
        .json({ message: "You can only rate picked_up posts" });
    }
    if (
      claim.claimer_id.toString() !== user_id ||
      claim.post_id.user_id.toString() !== user_id
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to rate this claim" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    if (claim.claimer_id.toString() === user_id) {
      await claim.updateOne({ $set: { rating_by_claimer: rating } });

      const post_owner = await User.findById(claim.post_id.user_id);
      if (post_owner && claim.post_id.type === "request") {
        post_owner.rating.count += 1;
        post_owner.rating.average_rating =
          (post_owner.rating.average_rating * post_owner.rating.count +
            rating) /
          post_owner.rating.count;
      }
      if (post_owner && claim.post_id.type === "donate") {
        post_owner.rating.count += 1;
        post_owner.rating.average_rating =
          (post_owner.rating.average_rating * post_owner.rating.count +
            rating) /
          post_owner.rating.count;
        post_owner.total_donation_made += 1;
      }

      await post_owner.save();
      return res
        .status(200)
        .json({ message: "Claim rated successfully", claim });
    }

    if (claim.post_id.user_id.toString() === user_id) {
      await claim.updateOne({ $set: { rating_by_post_owner: rating } });
      const claimer = await User.findById(claim.claimer_id);
      const post_owner = await User.findById(claim.post_id.user_id);
      if (claimer && claim.post_id.type === "request") {
        claimer.rating.count += 1;
        claimer.rating.average_rating =
          (claimer.rating.average_rating * claimer.rating.count + rating) /
          claimer.rating.count;
        post_owner.total_requests_fulfilled += 1;
      }
      if (claimer && claim.post_id.type === "donate") {
        claimer.rating.count += 1;
        claimer.rating.average_rating =
          (claimer.rating.average_rating * claimer.rating.count + rating) /
          claimer.rating.count;
      }
      await claimer.save();
      await post_owner.save();
      return res
        .status(200)
        .json({ message: "Claim rated successfully", claim });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error rating claim", error });
  }
};

module.exports = { create, getClaimsByPostId, updateClaimStatus, rating };
