import ApiResponse from "../../utils/apiResponse.js";
import { getMessageService } from "./message.service.js";

export const getMessageController = async (req, res, next) => {
    try {
        const { problemId } = req.params;

        const messages = await getMessageService(problemId);

        res.status(200).json(
            new ApiResponse(200, messages, "Messages fetched successfully")
        );
    } catch (error) {
        next(error);
    }
};