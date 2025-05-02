const {Status} = require('../models/status.model');

const create = async (post_id) => {

    try {
        const status = new Status({
            post_id
        });
        await status.save();
        return status;
    } catch (error) {
        throw new Error('Error creating status: ' + error.message);
    }
}

const update = async (post_id, status) => {
    try {
        const updatedStatus = await Status.findOneAndUpdate(
            { post_id },
            { status },
            { new: true }
        );
        return updatedStatus;
    } catch (error) {
        throw new Error('Error updating status: ' + error.message);
    }
}

const getStatusByPostId = async (post_id) => {
    try {
        if (!post_id) {
            throw new Error('Post ID is required');
        }
        const status = await Status.findOne({ post_id });
        if (!status) {
            throw new Error('Status not found');
        }
        return status;
    }
    catch (error) {
        throw new Error('Error fetching status: ' + error.message);
    }   
}


module.exports = { create, update, getStatusByPostId };