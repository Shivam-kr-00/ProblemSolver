import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2';
import https from 'https';
import { env } from './env.js';

// ─── Google OAuth Strategy ────────────────────────────────────────────────────

if (env.googleClientId && env.googleClientSecret) {
    const googleCallbackURL = `${env.backendUrl}/api/auth/google/callback`;
    console.log(`[Passport] Google callbackURL registered: ${googleCallbackURL}`);

    const googleStrategy = new GoogleStrategy(
        {
            clientID: env.googleClientId,
            clientSecret: env.googleClientSecret,
            callbackURL: googleCallbackURL,
            // Disable session-based state CSRF (app uses JWT — no express-session configured).
            // Without this, passport-google-oauth20 v2 tries req.session.state and fails.
            state: false,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                return done(null, profile);
            } catch (error) {
                return done(error);
            }
        }
    );



    passport.use(googleStrategy);
} else {
    console.warn('[Passport] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set — Google OAuth disabled.');
}

// ─── GitHub OAuth Strategy ────────────────────────────────────────────────────

if (env.githubClientId && env.githubClientSecret) {
    const githubCallbackURL = `${env.backendUrl}/api/auth/github/callback`;
    console.log(`[Passport] GitHub callbackURL registered: ${githubCallbackURL}`);

    passport.use(
        new GithubStrategy(
            {
                clientID: env.githubClientId,
                clientSecret: env.githubClientSecret,
                callbackURL: githubCallbackURL,
                // Same reason as Google — disable state to avoid session dependency
                state: false,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    return done(null, profile);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
} else {
    console.warn('[Passport] GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not set — GitHub OAuth disabled.');
}

export default passport;
