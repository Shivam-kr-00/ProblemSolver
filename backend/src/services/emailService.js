import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

/**
 * Email service — Brevo SMTP is used first, Gmail as fallback.
 *
 * WHY Brevo is prioritised over Gmail:
 *   Render free tier blocks IPv6 outbound connections.
 *   Gmail SMTP (smtp.gmail.com) resolves to IPv6 → ENETUNREACH on Render.
 *   Brevo SMTP (smtp-relay.brevo.com) uses IPv4 → works on Render free tier.
 *
 * Required environment variables (set at least ONE pair):
 *   Brevo:  BREVO_SMTP_USER + BREVO_SMTP_KEY   ← preferred for production
 *   Gmail:  EMAIL_USER + EMAIL_APP_PASSWORD      ← works locally, blocked on Render free
 */

let transporter = null;
let activeProvider = null;

if (env.brevoSmtpUser && env.brevoSmtpKey) {
    // ── Brevo SMTP (IPv4, works on Render free tier) ─────────────────────────
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

} else if (env.emailUser && env.emailAppPassword) {
    // ── Gmail SMTP (IPv6, works locally but blocked on Render free tier) ─────
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

} else {
    console.warn(
        '[EmailService] ⚠️  No email credentials found!\n' +
        '  Add BREVO_SMTP_USER + BREVO_SMTP_KEY to your Render environment variables.\n' +
        '  OTP emails will fail until this is configured.'
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
            'Add BREVO_SMTP_USER + BREVO_SMTP_KEY environment variables on Render.'
        );
    }

    // Use the sender address appropriate for each provider
    const senderAddress = env.brevoSmtpUser
        ? (env.emailUser || env.brevoSmtpUser)   // Brevo sends from your verified email
        : env.emailUser;

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