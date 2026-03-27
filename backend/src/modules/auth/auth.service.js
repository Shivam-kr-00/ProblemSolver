import jwt from 'jsonwebtoken';
import { redisClient } from '../../config/redis.js';
import { env } from '../../config/env.js';
import apiError from '../../utils/apiError.js';

export const generateToken = (userId) => {

    if (!userId) {
        throw new apiError("User ID is required to generate token", 400);
    }

    if (!env.accessSecret || !env.refreshSecret) {
        throw new apiError("JWT secrets are not configured properly", 500);
    }

    const accessToken = jwt.sign({ userId }, env.accessSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, env.refreshSecret, { expiresIn: '7d' });

    return { accessToken, refreshToken };
}

// Store refresh token in Redis
export const storeRefreshToken = async (userId, refreshToken) => {

    if (!userId || !refreshToken) {
        throw new apiError("User ID and refresh token are required", 400);
    }

    await redisClient.set(
        userId.toString(),
        refreshToken,
        "EX",
        7 * 24 * 60 * 60
    );
}

// set tokens in cookies

export const setCookies = (res, accessToken, refreshToken) => {

    if (!res) {
        throw new apiError("Response object is required", 500);
    }

    if (!accessToken || !refreshToken) {
        throw new apiError("Access and Refresh tokens are required", 400);
    }

    //set access token in cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true, // prvent client side js access
        secure: env.nodeEnv === 'production', // only send over https
        sameSite: env.nodeEnv === 'production' ? 'none' : 'strict', // prevent csrf
        maxAge: 15 * 60 * 1000,
    });

    //set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // prvent client side js access
        secure: env.nodeEnv === 'production', // only send over https
        sameSite: env.nodeEnv === 'production' ? 'none' : 'strict', // prevent csrf
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

// refresh token

export const refreshTokenService = async (refreshToken) => {

    if (!refreshToken) {
        throw new apiError("Refresh token is required", 401);
    }

    if (!env.refreshSecret || !env.accessSecret) {
        throw new apiError("JWT secrets are not configured properly", 500);
    }

    let decoded;

    try {
        decoded = jwt.verify(refreshToken, env.refreshSecret);
    } catch (error) {
        throw new apiError("Invalid or expired refresh token", 401);
    }

    const userId = decoded.userId;

    if (!userId) {
        throw new apiError("Invalid refresh token payload", 401);
    }

    // Check if token exists in Redis
    const storedToken = await redisClient.get(userId.toString());

    if (!storedToken) {
        throw new apiError("Refresh token not found. Please login again.", 401);
    }

    if (storedToken !== refreshToken) {
        throw new apiError("Refresh token mismatch", 403);
    }

    // Generate new tokens (Rotation)
    const newAccessToken = jwt.sign(
        { userId },
        env.accessSecret,
        { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
        { userId },
        env.refreshSecret,
        { expiresIn: '7d' }
    );

    // Replace old refresh token in Redis
    await redisClient.set(
        userId.toString(),
        newRefreshToken,
        "EX",
        7 * 24 * 60 * 60
    );

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};
