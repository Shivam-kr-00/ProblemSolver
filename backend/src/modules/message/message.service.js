import { Message } from "./message.model.js"



export const saveMessageService = async ({ problemId, senderId, text }) => {

    const message = await Message.create({
        problemId,
        senderId,
        text
    })
    return message
}

export const getMessageService = async (problemId) => {
    const messages = await Message.find({ problemId })
        .sort({ createdAt: 1 })
        .populate("senderId", "name")

    return messages
}