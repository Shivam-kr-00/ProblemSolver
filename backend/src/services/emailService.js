import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Validate that email credentials are configured
// This prevents hanging SMTP connections on startup/send when env vars are missing
if (!env.emailUser || !env.emailAppPassword) {
    console.warn(
        '[EmailService] WARNING: EMAIL_USER or EMAIL_APP_PASSWORD is not set. ' +
        'OTP emails will fail. Please add these environment variables on Render.'
    );
}

// Gmail SMTP transporter using App Password
// Works locally and on Render (port 587 is not blocked by Render)
// Requires: EMAIL_USER=yourname@gmail.com, EMAIL_APP_PASSWORD=your-16-char-app-password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.emailUser,
        pass: env.emailAppPassword,
    },
    // Hard timeouts so a misconfigured SMTP doesn't hang the HTTP request
    connectionTimeout: 10000,  // 10s to establish TCP connection
    greetingTimeout: 10000,    // 10s for SMTP greeting
    socketTimeout: 15000,      // 15s of socket inactivity allowed
});

export const sendEmail = async (to, subject, text, html) => {
    // Fail fast and clearly if credentials aren't configured
    if (!env.emailUser || !env.emailAppPassword) {
        throw new Error(
            'Email service not configured: EMAIL_USER and EMAIL_APP_PASSWORD must be set as environment variables.'
        );
    }

    const mailOptions = {
        from: `"ProblemFindr" <${env.emailUser}>`,
        to,
        subject,
        text,
        html,
    };

    // Errors propagate to the controller for proper error responses
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via Gmail:', info.messageId);
    return info;
};