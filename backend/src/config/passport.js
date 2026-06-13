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

    /**
     * Override passport-google-oauth20's built-in userProfile method.
     *
     * The default implementation fetches from https://www.googleapis.com/oauth2/v3/userinfo
     * which may be blocked in certain network environments (ECONNRESET).
     *
     * On Render (production) www.googleapis.com IS accessible, so we use the standard
     * userinfo endpoint. The tokeninfo override remains as a fallback via the hostname choice.
     *
     * tokeninfo returns: { sub, email, email_verified, name, picture, given_name, family_name }
     */
    googleStrategy.userProfile = function (accessToken, done) {
        // In production (Render), www.googleapis.com is accessible.
        // In local dev where www.googleapis.com is blocked, use oauth2.googleapis.com/tokeninfo.
        const isProduction = process.env.NODE_ENV === 'production';

        const options = isProduction
            ? {
                hostname: 'www.googleapis.com',
                path: '/oauth2/v3/userinfo',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                    Connection: 'close',
                },
            }
            : {
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
                console.log(`[Google userProfile] status=${res.statusCode}`);

                let json;
                try {
                    json = JSON.parse(raw);
                } catch (e) {
                    return done(new Error(`Failed to parse Google userinfo response: ${e.message}`));
                }

                if (json.error || res.statusCode !== 200) {
                    return done(new Error(
                        `Google userinfo error ${res.statusCode}: ${json.error_description || json.error || raw}`
                    ));
                }

                // Normalize to the same shape googleCallback expects
                const profile = {
                    provider: 'google',
                    id: json.sub,
                    displayName: json.name || '',
                    name: {
                        givenName: json.given_name || '',
                        familyName: json.family_name || '',
                    },
                    emails: json.email
                        ? [{ value: json.email, verified: json.email_verified === 'true' || json.email_verified === true }]
                        : [],
                    photos: json.picture
                        ? [{ value: json.picture }]
                        : [],
                    _json: json,
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
