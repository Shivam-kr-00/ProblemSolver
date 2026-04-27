import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    otpHash: {
        type: String,
        required: [true, "OTP hash is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Document automatically deleted after 10 mins
    }
}, { timestamps: true })

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
