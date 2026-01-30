import { generateToken, storeRefreshToken, setCookies } from "./auth.service.js";
import User from "./auth.model.js";
import jwt from 'jsonwebtoken';
import { redisClient } from '../../config/redis.js';
import { env } from '../../config/env.js';



export const signup = async (req, res) => {
    console.log('Raw request body:', req.body);
    console.log('Request headers:', req.headers);

    const { name, email, password } = req.body || {};
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });
        const { accessToken, refreshToken } = generateToken(user._id);

        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            message: "User created successfully"
        });
    } catch (err) {
        console.log("Error in signup controller:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }
        const user = await User.findOne({ email }).select("+password");

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, env.refreshSecret);
                await redisClient.del(decoded.userId.toString());
            } catch (err) {
                console.log("Token already expired or invalid during logout");
            }
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("Error in Logout controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// refresh new access token automatically
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshTokenFromCookie = req.cookies.refreshToken;

        if (!refreshTokenFromCookie) {
            return res.status(401).json({ message: "No refresh token found" });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshTokenFromCookie, env.refreshSecret);
        } catch (err) {
            // Handle specific JWT errors
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Refresh token expired" });
            }
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const storedRefreshToken = await redisClient.get(decoded.userId.toString());

        if (storedRefreshToken !== refreshTokenFromCookie) {
            return res.status(401).json({ message: "Session expired or invalid" });
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, env.accessSecret, { expiresIn: '15m' });


        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: env.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({ message: "Access token refreshed successfully" });
    }
    catch (error) {
        console.log("Error in refreshAccessToken controller:", error.message);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}