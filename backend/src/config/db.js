import mongoose from "mongoose";
import { env } from "./env.js";
import User from "../modules/auth/auth.model.js";


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.mongoUri)
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Drop conflicting unique indexes and recreate them properly with sparse flag
        // This fixes the E11000 duplicate key error for null OAuth IDs
        try {
            await User.collection.dropIndex("googleId_1");
            console.log("Dropped googleId index (will be recreated properly)");
        } catch (err) {
            // Index might not exist, that's fine
        }

        try {
            await User.collection.dropIndex("githubId_1");
            console.log("Dropped githubId index (will be recreated properly)");
        } catch (err) {
            // Index might not exist, that's fine
        }

        // Create proper sparse unique indexes
        await User.collection.createIndex({ googleId: 1 }, { sparse: true });
        await User.collection.createIndex({ githubId: 1 }, { sparse: true });
        console.log("Recreated googleId and githubId indexes with sparse flag");

    } catch (error) {
        console.log("mongoDB connection Error :", error)
    }
}