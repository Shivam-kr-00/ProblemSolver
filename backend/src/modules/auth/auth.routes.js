import express from 'express';
import { ROUTES } from '../../constants.js';
import { login, logout, signup, refreshTokenController, getprofile, verifyEmail, verifyLoginOtp, googleCallback, githubCallback } from './auth.controller.js';
import { protectRoute } from '../../middlewares/auth.middleware.js';
import passport from '../../config/passport.js';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Traditional Auth Routes
router.post(ROUTES.LOGIN, login);
router.post(ROUTES.REGISTER, signup);
router.post(ROUTES.LOGOUT, logout);
router.post("/refresh-token", refreshTokenController);
router.get("/profile", protectRoute, getprofile);
router.post("/verify-email", verifyEmail);
router.post("/verify-login-otp", verifyLoginOtp);

// Google OAuth Routes
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// Use passport callback form so Passport errors (e.g. network failure during
// token exchange) are caught here and redirect gracefully instead of 500ing
router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, profile) => {
        if (err) {
            // Log the full Google error to diagnose the root cause
            logger.error(`Google Passport error: ${err.message}`, {
                statusCode: err.statusCode,
                googleError: err.data ? (() => { try { return JSON.parse(err.data); } catch { return err.data; } })() : null,
                oauthError: err.oauthError,
            });
            return res.redirect(`${env.frontendUrl}/login?error=google_auth_failed`);
        }
        if (!profile) {
            logger.warn("Google OAuth: no profile returned");
            return res.redirect(`${env.frontendUrl}/login?error=google_auth_failed`);
        }
        req.user = profile;
        next();
    })(req, res, next);
}, googleCallback);

// GitHub OAuth Routes
router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["user:email", "profile"],
    })
);

// Same pattern for GitHub
router.get("/github/callback", (req, res, next) => {
    passport.authenticate("github", { session: false }, (err, profile) => {
        if (err) {
            logger.error(`GitHub Passport error: ${err.message}`, {
                statusCode: err.statusCode,
                githubError: err.data ? (() => { try { return JSON.parse(err.data); } catch { return err.data; } })() : null,
            });
            return res.redirect(`${env.frontendUrl}/login?error=github_auth_failed`);
        }
        if (!profile) {
            logger.warn("GitHub OAuth: no profile returned");
            return res.redirect(`${env.frontendUrl}/login?error=github_auth_failed`);
        }
        req.user = profile;
        next();
    })(req, res, next);
}, githubCallback);

export default router;