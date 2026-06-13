import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2';
import https from 'https';
import { env } from './env.js';

// ─── Google OAuth Strategy ────────────────────────────────────────────────────

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

/**
 * Override passport-google-oauth20's built-in userProfile method.
 *
 * The default implementation fetches from https://www.googleapis.com/oauth2/v3/userinfo
 * which is blocked on this machine (ECONNRESET).
 *
 * We use https://oauth2.googleapis.com/tokeninfo instead — a different Google host
 * that IS accessible and returns the same user fields: sub, email, name, picture.
 *
 * tokeninfo returns: { sub, email, email_verified, name, picture, given_name, family_name, ... }
 */
googleStrategy.userProfile = function (accessToken, done) {
    const options = {
        hostname: 'oauth2.googleapis.com',
        path: `/tokeninfo?access_token=${encodeURIComponent(accessToken)}`,
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Connection: 'close',
        },
    };

    const req = https.request(options, (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
            console.log(`[Google userProfile] tokeninfo status=${res.statusCode} body=${raw}`);

            let json;
            try {
                json = JSON.parse(raw);
            } catch (e) {
                return done(new Error(`Failed to parse Google tokeninfo response: ${e.message}`));
            }

            // tokeninfo returns error field when token is invalid/expired
            if (json.error || res.statusCode !== 200) {
                return done(new Error(
                    `Google tokeninfo error ${res.statusCode}: ${json.error_description || json.error || raw}`
                ));
            }

            // Normalize to the same shape googleCallback expects
            // (same as what passport-google-oauth20 normally builds from userinfo)
            const profile = {
                provider: 'google',
                id: json.sub,                       // Google user ID
                displayName: json.name || '',
                name: {
                    givenName: json.given_name || '',
                    familyName: json.family_name || '',
                },
                emails: json.email
                    ? [{ value: json.email, verified: json.email_verified === 'true' }]
                    : [],
                photos: json.picture
                    ? [{ value: json.picture }]
                    : [],
                _json: json,                        // raw Google response (controller uses this too)
            };

            done(null, profile);
        });
    });

    req.on('error', (e) => {
        console.error(`[Google userProfile] Network error: ${e.message}`);
        done(new Error(`Network error fetching Google user profile: ${e.message}`));
    });

    req.end();
};

passport.use(googleStrategy);

// ─── GitHub OAuth Strategy ────────────────────────────────────────────────────

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

export default passport;
