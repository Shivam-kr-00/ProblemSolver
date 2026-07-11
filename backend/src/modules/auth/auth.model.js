import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../../constants.js";

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
      required: function () {
        return !this.googleId && !this.githubId;
      },
      minlength: [6, "Password must be at least 6 characters long"],
    },

    googleId: {
      type: String,
      default: undefined,
    },

    githubId: {
      type: String,
      default: undefined,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.PUBLIC,
    },

    profileImageUrl: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    skills: {
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

    Verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// OAuth indexes
authSchema.index(
  { googleId: 1 },
  {
    unique: true,
    sparse: true,
  }
);

authSchema.index(
  { githubId: 1 },
  {
    unique: true,
    sparse: true,
  }
);

// Hash password
authSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
authSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", authSchema);

export default User;