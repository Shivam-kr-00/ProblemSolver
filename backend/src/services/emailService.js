import https from 'https';
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

/**
 * Email service — tries providers in this order:
 *
 * 1. Brevo REST API  (BREVO_API_KEY = xkeysib-...)  → HTTPS port 443, works on Render
 * 2. Brevo SMTP      (BREVO_SMTP_KEY = xsmtpsib-...) → port 587, works locally only
 * 3. Gmail SMTP      (EMAIL_USER + EMAIL_APP_PASSWORD) → port 587, works locally only
 *
 * For Render (production): Add BREVO_API_KEY to environment variables.
 * For local dev: BREVO_SMTP_KEY or EMAIL_USER already works.
 *
 * How to get BREVO_API_KEY:
 *   brevo.com → top-right avatar → Settings → API Keys → Generate API key
 *   It will start with "xkeysib-..."
 */

// ─── Determine active provider ────────────────────────────────────────────────

let activeProvider = null;
let smtpTransporter = null;

if (env.brevoApiKey) {
    activeProvider = 'brevo-api';
    console.log('[EmailService] Using provider: Brevo REST API (HTTPS — works on Render)');

} else if (env.brevoSmtpKey && env.brevoSmtpUser) {
    activeProvider = 'brevo-smtp';
    smtpTransporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: { user: env.brevoSmtpUser, pass: env.brevoSmtpKey },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
    console.log('[EmailService] Using provider: Brevo SMTP (local dev only)');

} else if (env.emailUser && env.emailAppPassword) {
    activeProvider = 'gmail';
    smtpTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: env.emailUser, pass: env.emailAppPassword },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
    console.log('[EmailService] Using provider: Gmail SMTP (local dev only)');

} else {
    console.warn(
        '[EmailService] ⚠️  No email provider configured!\n' +
        '  For Render: add BREVO_API_KEY (xkeysib-...) to environment variables.\n' +
        '  Get it: brevo.com → Settings → API Keys → Generate'
    );
}

// ─── sendEmail ────────────────────────────────────────────────────────────────

export const sendEmail = async (to, subject, text, html) => {
    if (!activeProvider) {
        throw new Error('Email service not configured. Add BREVO_API_KEY to Render environment variables.');
    }

    const senderEmail = env.emailUser || env.brevoSmtpUser || 'noreply@problemfindr.com';

    // ── Brevo REST API (production / Render) ──────────────────────────────────
    if (activeProvider === 'brevo-api') {
        const payload = JSON.stringify({
            sender: { name: 'ProblemFindr', email: senderEmail },
            to: [{ email: to }],
            subject,
            htmlContent: html || `<p>${text}</p>`,
            textContent: text,
        });

        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'api.brevo.com',
                path: '/v3/smtp/email',
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': env.brevoApiKey,
                    'content-type': 'application/json',
                    'content-length': Buffer.byteLength(payload),
                },
            }, (res) => {
                let raw = '';
                res.on('data', (c) => (raw += c));
                res.on('end', () => {
                    let json;
                    try { json = JSON.parse(raw); } catch { json = raw; }

                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log('[EmailService] Sent via Brevo API, id:', json.messageId);
                        resolve(json);
                    } else {
                        reject(new Error(`Brevo API ${res.statusCode}: ${json?.message || raw}`));
                    }
                });
            });

            req.setTimeout(15000, () => { req.destroy(); reject(new Error('Brevo API timed out')); });
            req.on('error', (e) => reject(new Error(`Brevo API network error: ${e.message}`)));
            req.write(payload);
            req.end();
        });
    }

    // ── SMTP fallback (local dev) ─────────────────────────────────────────────
    const info = await smtpTransporter.sendMail({
        from: `"ProblemFindr" <${senderEmail}>`,
        to,
        subject,
        text,
        html,
    });
    console.log(`[EmailService] Sent via ${activeProvider}:`, info.messageId);
    return info;
};