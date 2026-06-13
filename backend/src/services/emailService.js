import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Gmail SMTP transporter using App Password
// Works locally and on Render (port 587 is not blocked)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.emailUser,
        pass: env.emailAppPassword,
    },
});

export const sendEmail = async (to, subject, text, html) => {
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