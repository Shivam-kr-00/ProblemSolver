import express from "express";
import cors from "cors";
import mainRouter from "./routes.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors());
app.use(cookieParser()); 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));






app.use('/api', mainRouter);

export { app };