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
    totalContributions: {
    type: Number,
    default: 0,
},

problemsCreated: {
    type: Number,
    default: 0,
},

tasksCompleted: {
    type: Number,
    default: 0,
},
    Verified:{
        type: Boolean,
        default:false
    }
    
},
    {
        timestamps: true
    });

// Pre-save hook to hash password before saving
authSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// Method to compare password during login
authSchema.methods.comparePassword = async function (candidatePassword) {
    try {       
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model('User', authSchema);

export default User;