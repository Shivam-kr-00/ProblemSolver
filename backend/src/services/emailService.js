import { Resend } from 'resend';
import { env } from '../config/env.js';

const resend = new Resend(env.resendApiKey);

export const sendEmail = async (to, subject, text, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // use this until you verify a custom domain
            to: to,
            subject: subject,
            text: text,
            html: html,
        });

        if (error) {
            console.error('Error in sending email', error);
            return;
        }

        console.log('Email sent successfully', data.id);
    } catch (error) {
        console.error('Error in sending email', error);
    }
};






//create a function to send mail