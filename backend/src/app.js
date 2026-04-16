import express from "express";
import cors from "cors";
import mainRouter from "./routes.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";
import { app } from "./config/socket.js";

app.set("trust proxy", 1);

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            "https://problem-solver-nu.vercel.app",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
        ].filter(Boolean);

        // Allow all Vercel preview deployments (*.vercel.app)
        if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/api', mainRouter);
app.use(errorMiddleware);

export { app };