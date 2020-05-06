const { createLogger, transports, format } = require('winston');

const config = require('../config');

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console(config.winston.console)
    ]
});


logger.stream = {
    write: (info) => {
        logger.info(info)
    }
}

module.exports = logger;