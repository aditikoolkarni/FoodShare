
const { Claim } = require('../models/claim.model');
const { Post } = require('../models/post.model');
const statusController = require('./status.controller'); // Import the status controller

const create = async(req,res) =>{
    const {post_id} = req.body
    
    if (!post_id) {
        return res.status(400).json({ message: "Post ID is required" });
    }

    try {
        const claim = new Claim({
            post_id,
            claimer_id:req.user_id
        });
        await claim.save();
        return res.status(201).json({ message: "Claim created successfully", claim });
    } catch (error) {
        return res.status(500).json({ message: "Error creating claim", error });
    }
}

const getClaimsByPostId = async (req, res) => {   //should be seen by the post owner only
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
            return res.status(403).json({ message: "You are not authorized to view these claims" });
        }

        const claims = await Claim.find({ post_id }).populate('claimer_id', 'username total_donation_made total_requests_fulfilled rating')
        if (!claims) {
            return res.status(404).json({ message: "No claims found for this post" });
        }
        return res.status(200).json(claims);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching claims", error });
    }
}

const updateClaimStatus = async (req, res) => {
    const { claim_id } = req.params;
    const { status } = req.body; // status can be 'approved' or 'rejected'

    try {
        const claim = await Claim.findById(claim_id).populate('post_id', 'user_id');
        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        if (claim.post_id.user_id.toString() !== req.user_id) {
            return res.status(403).json({ message: "You are not authorized to update this claim" });
        }

        claim.status = status;
        await claim.save();

        if (status === 'approved') {
           const status = await statusController.update(claim.post_id._id, status); // Update the status of the post
             
                if (!status) {
                    return res.status(500).json({ message: "Error updating post status" });
                }
        }
        return res.status(200).json({ message: "Claim status updated successfully", claim });
    } catch (error) {
        return res.status(500).json({ message: "Error updating claim status", error });
    }
}



module.exports = {create, getClaimsByPostId, updateClaimStatus}