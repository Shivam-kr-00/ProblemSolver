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
    brevoApiKey: process.env.BREVO_API_KEY,        // REST API key (xkeysib-...) — for Render
    brevoSmtpUser: process.env.BREVO_SMTP_USER,
    brevoSmtpKey: process.env.BREVO_SMTP_KEY,      // SMTP key (xsmtpsib-...) — for local dev
    brevoSenderEmail: process.env.BREVO_SENDER_EMAIL, // Brevo sender email (from Brevo Dashboard → Senders)
    emailUser: process.env.EMAIL_USER,
    emailAppPassword: process.env.EMAIL_APP_PASSWORD,

    // EmailJS configuration
    emailjsServiceId: process.env.EMAILJS_SERVICE_ID || process.env.SERVICE_ID,
    emailjsTemplateId: process.env.EMAILJS_TEMPLATE_ID || process.env.TEMPLATE_ID,
    emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || process.env.PUBLIC_KEY,
    emailjsPrivateKey: process.env.EMAILJS_PRIVATE_KEY || process.env.PRIVATE_KEY,

    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,

};
