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
    backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',

    //cloudinary configuration
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

    //email configuration
    resendApiKey: process.env.RESEND_API_KEY,
    brevoSmtpUser: process.env.BREVO_SMTP_USER,
    brevoSmtpKey: process.env.BREVO_SMTP_KEY,
    emailUser: process.env.EMAIL_USER,
    emailAppPassword: process.env.EMAIL_APP_PASSWORD,

    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,

};
