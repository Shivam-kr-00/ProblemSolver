import { generateToken, storeRefreshToken, setCookies } from "./auth.service.js";
import User from "./auth.model.js";
import jwt from 'jsonwebtoken';
import { redisClient } from '../../config/redis.js';
import { env } from '../../config/env.js';
import ApiResponse from "../../utils/apiResponse.js";
import logger from "../../utils/logger.js"; 

export const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            const error = new Error("Name, email, and password are required");
            error.statusCode = 400;
            throw error;
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            const error = new Error("User already exists");
            error.statusCode = 400;
            throw error;
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
         next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Email and Password are required");
            error.statusCode = 400;
            throw error;
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
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }
    } catch (error) {
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
            const error = new Error("No refresh token found");
            error.statusCode = 401;
            throw error;
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshTokenFromCookie, env.refreshSecret);
        } catch (err) {
            const message = err.name === 'TokenExpiredError' ? "Refresh token expired" : "Invalid refresh token";
            const error = new Error(message);
            error.statusCode = 401;
            throw error; 
        }

        const storedRefreshToken = await redisClient.get(decoded.userId.toString());

        if (storedRefreshToken !== refreshTokenFromCookie) {
            const error = new Error(`Session Mismatch: Potential token reuse for user ${decoded.userId}`);
            error.statusCode = 401;
            throw error; 
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, env.accessSecret, { expiresIn: '15m' });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: env.nodeEnv === 'production',
            sameSite: 'strict',
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