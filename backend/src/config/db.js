import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.mongoUri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Automatically create indexes defined in schemas
        await mongoose.connection.syncIndexes();

        console.log("Database indexes synchronized.");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw error;
    }
};