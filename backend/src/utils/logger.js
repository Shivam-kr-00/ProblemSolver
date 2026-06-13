import winston from 'winston';

// Define log levels (standard npm levels)
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define colors for each level (makes console reading easy)
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

// Define the format of the logs
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => {
        // Print message + any extra metadata (e.g. statusCode, googleError, stack)
        const { timestamp, level, message, ...meta } = info;
        const metaStr = Object.keys(meta).length
            ? '\n' + JSON.stringify(meta, null, 2)
            : '';
        return `${timestamp} ${level}: ${message}${metaStr}`;
    })
);

// Define where the logs should go (Transports)
const transports = [
    // 1. Output to the console
    new winston.transports.Console(),

    // 2. Save only "error" logs to a specific file
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),

    // 3. Save ALL logs (info, warn, error) to a combined file
    new winston.transports.File({ filename: 'logs/combined.log' }),
];

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
    levels,
    format,
    transports,
});

export default logger;