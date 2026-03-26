import mongoose from 'mongoose'
import { PROBLEM_STATUS } from '../../constants.js'
const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 100
    },

    description: {
        type: String,
        required: true,
        minlength: 20
    },

    category: {
        type: String,
        enum: ['public', 'private', 'government'],
        default: 'public',
        index: true
    },

    region: {
        type: String,
        default: 'Global',
        index: true
    },

    tags: {
        type: [String],
        lowercase: true,
        trim: true,
        default: []
    },

    repositoryUrl: {
        type: String,
        trim: true,
        default: "",
    },

    status: {
        type: String,
        enum: Object.values(PROBLEM_STATUS),
        default: PROBLEM_STATUS.OPEN,
        index: true
    },

    pendingContributors: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },

    contributors: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },

    upvotes: {
        type: Number,
        default: 0
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }

}, { timestamps: true });

problemSchema.index({ title: 'text', description: 'text', tags: 'text' });


const Problem = mongoose.model("Problem", problemSchema);

export default Problem;