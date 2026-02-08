import User from "../modules/auth/auth.model.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ROLES } from "../constants.js";

export const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized! No token provided." });
        }

        try {
            const decoded = jwt.verify(token, env.accessSecret);
            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                return res.status(401).json({ message: "Unauthorized! User not found." })

            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized! Token has expired." });
            }
            throw error;

        }

    } catch (error) {
        console.log("Error in protectRoute Controller", error.message)
        res.status(500).json({ message: "Internal server error" });
    }

}

export const adminRoute = async (req, res, next) => {
    if (req.user && req.user.role === ROLES.ADMIN) {
        next();
    }
    else {
        res.status(403).json({ message: "Access Denied! Admins only." });
    }
}