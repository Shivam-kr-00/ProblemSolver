import { generateToken, storeRefreshToken, setCookies, refreshTokenService } from "./auth.service.js";
import User from "./auth.model.js";
import jwt from 'jsonwebtoken';
import { redisClient } from '../../config/redis.js';
import { env } from '../../config/env.js';
import ApiResponse from "../../utils/apiResponse.js";
import logger from "../../utils/logger.js";
import ApiError from "../../utils/apiError.js";
import cloudinary from "../../config/cloudinary.js";

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

        const user = await User.create({ name, email, password });

        logger.info(`User created successfully: ${user.email}`);

        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(201).json(
            new ApiResponse(201, {
                id: user._id,
                name: user.name,
                email: user.email
            }, "User created successfully")
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

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            logger.info(`User logged in: ${email}`);


            res.status(200).json(
                new ApiResponse(200, {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }, "Login successful")
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
                // Info log for cleanup skip is fine as it's not a critical error
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

