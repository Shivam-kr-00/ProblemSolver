import { generateToken, storeRefreshToken, setCookies, refreshTokenService } from "./auth.service.js";
import User from "./auth.model.js";
import jwt from 'jsonwebtoken';
import { redisClient } from '../../config/redis.js';
import { env } from '../../config/env.js';
import ApiResponse from "../../utils/apiResponse.js";
import logger from "../../utils/logger.js";
import ApiError from "../../utils/apiError.js";
import cloudinary from "../../config/cloudinary.js";
import { generateOtp, getOtpHtml } from "../../utils/utils.js";
import OTP from "./otp.model.js";
import { sendEmail } from "../../services/emailService.js";
import bcrypt from 'bcryptjs';

export const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            throw new ApiError("Name, email, and password are required", 400);
        }

        logger.info(`[Signup] Step 1: Checking if user exists for ${email}`);
        const userExist = await User.findOne({ email });
        if (userExist) {
            throw new ApiError("User already exists", 400);
        }

        logger.info(`[Signup] Step 2: Storing pending user in Redis`);
        await redisClient.setex(`signup:${email}`, 600, JSON.stringify({ name, password }));

        logger.info(`[Signup] Step 3: Generating OTP`);
        const otp = generateOtp();
        const html = getOtpHtml(otp);
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);

        logger.info(`[Signup] Step 4: Saving OTP to DB`);
        await OTP.deleteMany({ email });
        await OTP.create({ email, otpHash });

        logger.info(`[Signup] Step 5: Sending email via Brevo to ${email}`);
        await sendEmail(email, "OTP Verification", `Your OTP Code is ${otp}`, html);

        logger.info(`[Signup] Done — OTP sent to ${email}`);
        res.status(201).json(
            new ApiResponse(201, null, "OTP sent to email. Please verify to complete registration.")
        );
    } catch (err) {
        logger.error(`Signup error at step: ${err.message}`);
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError("Email and Password are required", 400);
        }

        const user = await User.findOne({ email }).select("+password");

        // Must check user exists BEFORE accessing any property on it
        if (!user) {
            throw new ApiError("Invalid email or password", 401);
        }

        if (!user.Verified) {
            throw new ApiError("Please verify your email first", 401);
        }

        if (await user.comparePassword(password)) {

            // Generate OTP for login
            const otp = generateOtp();
            const html = getOtpHtml(otp);

            const salt = await bcrypt.genSalt(10);
            const otpHash = await bcrypt.hash(otp, salt);

            await OTP.deleteMany({ email }); // Clear old OTPs

            await OTP.create({
                email,
                otpHash,
                user: user._id
            });

            await sendEmail(email, "Login OTP Verification", `Your Login OTP Code is ${otp}`, html);

            res.status(200).json(
                new ApiResponse(200, { email: user.email }, "Credentials verified. OTP sent to email.")
            );
        } else {
            throw new ApiError("Invalid email or password", 401);
        }
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, env.refreshSecret);
                await redisClient.del(decoded.userId.toString());
                logger.info(`Redis session cleared for user: ${decoded.userId}`);
            } catch (err) {
                logger.info("Logout: Redis cleanup skipped (token expired)");
            }
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json(
            new ApiResponse(200, null, "Logged out successfully")
        );
    } catch (error) {
        next(error);
    }
};

export const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshTokenFromCookie = req.cookies.refreshToken;

        if (!refreshTokenFromCookie) {
            throw new ApiError("No refresh token found", 401);
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshTokenFromCookie, env.refreshSecret);
        } catch (err) {
            const message = err.name === 'TokenExpiredError' ? "Refresh token expired" : "Invalid refresh token";
            throw new ApiError(message, 401);
        }

        const storedRefreshToken = await redisClient.get(decoded.userId.toString());

        if (storedRefreshToken !== refreshTokenFromCookie) {
            throw new ApiError(`Session Mismatch: Potential token reuse for user ${decoded.userId}`, 401);
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, env.accessSecret, { expiresIn: '15m' });

        const isProduction = env.nodeEnv === 'production' || process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 15 * 60 * 1000,
        });

        logger.info(`Access token refreshed for user: ${decoded.userId}`);

        res.status(200).json(
            new ApiResponse(200, null, "Access token refreshed successfully")
        );
    } catch (error) {
        next(error);
    }
};

export const refreshTokenController = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        const { accessToken, refreshToken: newRefreshToken } =
            await refreshTokenService(refreshToken);

        setCookies(res, accessToken, newRefreshToken);

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully"
        });

    } catch (error) {
        next(error);
    }
};

export const getprofile = async (req, res, next) => {
    try {
        // Get user ID from JWT token in cookies
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new ApiError("No access token found. Please login again.", 401);
        }

        // Decode token to get user ID
        let decoded;
        try {
            decoded = jwt.verify(token, env.accessSecret);
        } catch (err) {
            throw new ApiError("Invalid or expired token", 401);
        }

        // Fetch user from database
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            throw new ApiError("User not found", 404);
        }

        res.status(200).json(
            new ApiResponse(200, user, "Profile retrieved successfully")
        );
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body; // You MUST extract 'email' from req.body as well
        if (!email || !otp) {
            throw new ApiError("Email and OTP are required", 400);
        }

        const otpdata = await OTP.findOne({ email }).sort({ createdAt: -1 }); // Get latest OTP
        if (!otpdata) {
            throw new ApiError("OTP is invalid or has expired", 400);
        }

        const isMatch = await bcrypt.compare(otp, otpdata.otpHash);
        if (!isMatch) {
            throw new ApiError("Invalid OTP", 401);
        }

        // Retrieve temporary user data from Redis
        const pendingUserStr = await redisClient.get(`signup:${email}`);
        if (!pendingUserStr) {
            throw new ApiError("Session expired or invalid. Please register again.", 400);
        }

        const pendingUser = JSON.parse(pendingUserStr);

        // Create the user now that they are verified
        const user = await User.create({
            name: pendingUser.name,
            email: email,
            password: pendingUser.password,
            Verified: true
        });

        await OTP.deleteMany({ email }); // Cleanup OTPs
        await redisClient.del(`signup:${email}`); // Cleanup Redis

        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        logger.info(`User verified and logged in successfully: ${email}`);

        res.status(200).json(
            new ApiResponse(200, {
                _id: user._id,
                name: user.name,
                email: user.email,
                Verified: user.Verified
            }, "Email verified and logged in successfully!")
        );

    } catch (error) {
        next(error);
    }
};

export const verifyLoginOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            throw new ApiError("Email and OTP are required", 400);
        }

        const otpdata = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!otpdata) {
            throw new ApiError("OTP is invalid or has expired", 401);
        }

        const isMatch = await bcrypt.compare(otp, otpdata.otpHash);
        if (!isMatch) {
            throw new ApiError("Incorrect OTP", 401);
        }

        await OTP.deleteMany({ email });

        const user = await User.findById(otpdata.user);
        if (!user) {
            throw new ApiError("User account not found. Please register again.", 404);
        }

        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        logger.info(`User logged in successfully via OTP: ${email}`);

        res.status(200).json(
            new ApiResponse(200, {
                _id: user._id,
                name: user.name,
                email: user.email,
                Verified: user.Verified
            }, "Login successful!")
        );

    } catch (error) {
        next(error);
    }
};


export const googleCallback = async (req, res, next) => {
    try {
        // STEP 1: Extract user data from Google (provided by Passport)
        // Note: req.user is the profile object returned by the Google strategy
        const profile = req.user;
        const googleId = profile.id;

        // DEBUG: Log the full profile structure
        logger.info("Google Profile Structure:", JSON.stringify(profile, null, 2));

        // Extract displayName - try multiple sources
        const displayName = profile.displayName ||
            profile._json?.name ||
            profile._json?.given_name ||
            "Google User";

        // Extract profile picture
        const profileImageUrl = profile.photos?.[0]?.value ||
            profile._json?.picture ||
            null;

        // Extract email - this is the critical part
        let email = null;

        // Try: profile.emails (Passport's normalized format)
        if (Array.isArray(profile.emails) && profile.emails.length > 0) {
            email = profile.emails[0].value;
            logger.info(`Email found in profile.emails: ${email}`);
        }
        // Try: profile._json.email (Google's raw response)
        else if (profile._json?.email) {
            email = profile._json.email;
            logger.info(`Email found in profile._json.email: ${email}`);
        }
        // Fallback: Create unique email from Google ID
        else {
            email = `user_${googleId}@google.oauth.local`;
            logger.warn(`No email found, using fallback: ${email}`);
        }

        // STEP 2: Find user by googleId first, then fall back to email
        let user = await User.findOne({ googleId });

        if (!user) {
            // Check if an account with this email already exists (e.g. email/password signup)
            user = await User.findOne({ email });

            if (user) {
                // Link the Google account to the existing email/password account
                user.googleId = googleId;
                user.Verified = true;
                if (profileImageUrl && !user.profileImageUrl) {
                    user.profileImageUrl = profileImageUrl;
                }
                await user.save();
                logger.info(`Linked Google OAuth to existing account: ${email}`);
            } else {
                // No account at all — create a brand new one
                user = await User.create({
                    googleId,
                    email,
                    name: displayName || `User ${googleId}`,
                    profileImageUrl,
                    Verified: true
                });
                logger.info(`New user created via Google OAuth: ${email}`);
            }
        } else {
            // User found by googleId — update profile picture only if user has no custom pic
            if (profileImageUrl && !user.profileImageUrl) {
                user.profileImageUrl = profileImageUrl;
                await user.save();
            }
            logger.info(`User logged in via Google OAuth: ${email}`);
        }

        // STEP 4: Generate JWT tokens (access + refresh)
        const { accessToken, refreshToken } = generateToken(user._id);

        // STEP 5: Store refresh token in Redis for validation on token refresh
        await storeRefreshToken(user._id, refreshToken);

        // STEP 6: Set tokens in HTTP-only cookies
        setCookies(res, accessToken, refreshToken);

        // STEP 7: Redirect to frontend callback page
        res.redirect(`${env.frontendUrl}/auth/callback`);

    } catch (error) {
        logger.error(`Google callback error: ${error.message}`, { stack: error.stack });
        // Redirect to frontend with error instead of leaving user on a blank 500 page
        res.redirect(`${env.frontendUrl}/login?error=google_auth_failed`);
    }
};


export const githubCallback = async (req, res, next) => {
    try {
        // STEP 1: Extract user data from GitHub (provided by Passport)
        const profile = req.user;
        const githubId = profile.id;

        // DEBUG: Log the full profile structure
        logger.info("GitHub Profile Structure:", JSON.stringify(profile, null, 2));

        // Extract displayName - GitHub doesn't always provide it
        const displayName = profile.displayName || profile.username || "GitHub User";

        // Extract profile picture
        const profileImageUrl = profile.photos?.[0]?.value || profile._json?.avatar_url || null;

        // Extract email - GitHub may have it private, use username as fallback
        let email = null;

        // Try: profile.emails (Passport's normalized format)
        if (Array.isArray(profile.emails) && profile.emails.length > 0) {
            email = profile.emails[0].value;
            logger.info(`Email found in profile.emails: ${email}`);
        }
        // Try: profile._json.email (GitHub's raw response)
        else if (profile._json?.email) {
            email = profile._json.email;
            logger.info(`Email found in profile._json.email: ${email}`);
        }
        // Fallback: Create email from username
        else if (profile.username) {
            email = `${profile.username}@github.com`;
            logger.warn(`No email found, using fallback: ${email}`);
        }
        // Last resort fallback
        else {
            email = `user_${githubId}@github.oauth.local`;
            logger.warn(`No email or username, using fallback: ${email}`);
        }

        // STEP 2: Find user by githubId first, then fall back to email
        let user = await User.findOne({ githubId });

        if (!user) {
            // Check if an account with this email already exists (e.g. email/password signup)
            user = await User.findOne({ email });

            if (user) {
                // Link the GitHub account to the existing email/password account
                user.githubId = githubId;
                user.Verified = true;
                if (profileImageUrl && !user.profileImageUrl) {
                    user.profileImageUrl = profileImageUrl;
                }
                await user.save();
                logger.info(`Linked GitHub OAuth to existing account: ${email}`);
            } else {
                // No account at all — create a brand new one
                user = await User.create({
                    githubId,
                    email,
                    name: displayName || `User ${githubId}`,
                    profileImageUrl,
                    Verified: true
                });
                logger.info(`New user created via GitHub OAuth: ${email}`);
            }
        } else {
            // User found by githubId — update profile picture if needed
            if (profileImageUrl) {
                user.profileImageUrl = profileImageUrl;
                await user.save();
            }
            logger.info(`User logged in via GitHub OAuth: ${email}`);
        }

        // STEP 4: Generate JWT tokens (access + refresh)
        const { accessToken, refreshToken } = generateToken(user._id);

        // STEP 5: Store refresh token in Redis for validation on token refresh
        await storeRefreshToken(user._id, refreshToken);

        // STEP 6: Set tokens in HTTP-only cookies
        setCookies(res, accessToken, refreshToken);

        // STEP 7: Redirect to frontend callback page
        res.redirect(`${env.frontendUrl}/auth/callback`);

    } catch (error) {
        logger.error(`GitHub callback error: ${error.message}`, { stack: error.stack });
        // Redirect to frontend with error instead of leaving user on a blank 500 page
        res.redirect(`${env.frontendUrl}/login?error=github_auth_failed`);
    }
};

