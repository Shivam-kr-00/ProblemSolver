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

        const userExist = await User.findOne({ email });
        if (userExist) {
            throw new ApiError("User already exists", 400);
        }

        // Store user data in Redis temporarily for 10 minutes (600 seconds)
        await redisClient.setex(`signup:${email}`, 600, JSON.stringify({ name, password }));

        logger.info(`Signup initiated for: ${email}, OTP pending`);

        const otp = generateOtp();
        const html = getOtpHtml(otp);

        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);

        await OTP.deleteMany({ email });

        await OTP.create({
            email,
            otpHash
        });

        await sendEmail(email, "OTP Verification", `Your OTP Code is ${otp}`, html);

        res.status(201).json(
            new ApiResponse(201, null, "OTP sent to email. Please verify to complete registration.")
        );
    } catch (err) {
        logger.error(`Signup error: ${err.message}`);
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
        if (!user.Verified) {
            throw new ApiError("Please Verify your email first", 401);
        }

        if (user && (await user.comparePassword(password))) {

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

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
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
        res.json(req.user);
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

