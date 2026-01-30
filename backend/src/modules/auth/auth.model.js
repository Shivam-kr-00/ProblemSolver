import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../../constants.js';


const authSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.PUBLIC,
    },

    //profile fields

    profileImageUrl: {
        type: String,
        default: "",

    },

    bio: {
        type: String,
        default: "",
    },
    skills:
    {
        type: [String],
        default: [],
    },
    githubUsername: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        trim: true,
        default: "",
    },
    reputation: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true
    });

// Pre-save hook to hash password before saving
authSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password during login
authSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', authSchema);

export default User;