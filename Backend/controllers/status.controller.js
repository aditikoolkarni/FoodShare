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


module.exports = { create, update };