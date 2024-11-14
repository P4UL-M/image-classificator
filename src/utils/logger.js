const { createLogger, format, transports } = require('winston');

const { printf, combine, timestamp, colorize } = format;

// Define custom log format (similar to Python's logging output)

let alignColorsAndTime = combine(
    timestamp({
        format: "YY-MM-DD HH:mm:ss"
    }),
    printf(({ level, message, timestamp }) => {
        const levelColorizer = colorize().colorize(level, level.toUpperCase());
        return `${timestamp} ${levelColorizer}: ${message}`;
    })
);

const logger = createLogger({
    level: 'info',
    format: combine(
        alignColorsAndTime
    ),
    transports: [
        new transports.Console(),  // Logs to the console
    ]
});

module.exports = { logger };