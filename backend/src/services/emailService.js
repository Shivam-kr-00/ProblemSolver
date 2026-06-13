import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

/**
 * Email service with automatic provider selection.
 *
 * Tries providers in order of priority:
 * 1. Gmail SMTP  (EMAIL_USER + EMAIL_APP_PASSWORD)
 * 2. Brevo SMTP  (BREVO_SMTP_USER + BREVO_SMTP_KEY)
 *
 * Set whichever credentials you have in your Render environment variables.
 * At least one provider must be configured for OTP emails to work.
 */

// ─── Build transporter from available credentials ─────────────────────────────

let transporter = null;
let activeProvider = null;

if (env.emailUser && env.emailAppPassword) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: env.emailUser,
            pass: env.emailAppPassword,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
    activeProvider = 'Gmail';

} else if (env.brevoSmtpUser && env.brevoSmtpKey) {
    transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: env.brevoSmtpUser,
            pass: env.brevoSmtpKey,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
    activeProvider = 'Brevo';

} else {
    console.warn(
        '[EmailService] ⚠️  No email credentials configured!\n' +
        '  Add one of these pairs to your Render environment variables:\n' +
        '  • Gmail:  EMAIL_USER + EMAIL_APP_PASSWORD\n' +
        '  • Brevo:  BREVO_SMTP_USER + BREVO_SMTP_KEY\n' +
        '  OTP emails will fail until credentials are set.'
    );
}

if (activeProvider) {
    console.log(`[EmailService] Using provider: ${activeProvider}`);
}

// ─── sendEmail ────────────────────────────────────────────────────────────────

export const sendEmail = async (to, subject, text, html) => {
    if (!transporter) {
        throw new Error(
            'Email service not configured. ' +
            'Set EMAIL_USER + EMAIL_APP_PASSWORD (Gmail) or ' +
            'BREVO_SMTP_USER + BREVO_SMTP_KEY (Brevo) in your environment variables.'
        );
    }

    const senderAddress = env.emailUser || env.brevoSmtpUser;

    const mailOptions = {
        from: `"ProblemFindr" <${senderAddress}>`,
        to,
        subject,
        text,
        html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email sent via ${activeProvider}:`, info.messageId);
    return info;
};