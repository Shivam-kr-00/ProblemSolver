import mongoose from "mongoose";
import { env } from "./env.js";


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.mongoUri)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("mongoDB connection Error :", error)
    }
}