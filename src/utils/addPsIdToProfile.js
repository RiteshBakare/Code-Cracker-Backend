import { asyncHandler } from "./asyncHandler.js";
import { User } from "../models/user.model.js";

const addPsIdToProfile = async (userId, ps_id) => {
    try {
        const result = await User.findOneAndUpdate(
            { _id: userId, problemSolved: { $ne: ps_id } },
            { $addToSet: { problemSolved: ps_id } },
            { new: true } // Return the updated document
        );

        if (!result) {
            // Either user not found or problem already solved
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return false;
    }
};

export default addPsIdToProfile;