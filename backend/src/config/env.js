import dotenv from 'dotenv';
dotenv.config();

// We create a clean object to export
export const env = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    upstashRedisUrl: process.env.UPSTASH_REDIS_URL,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV || 'development',
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};
