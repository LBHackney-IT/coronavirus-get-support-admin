require('dotenv').config(); // this loads the defined variables from .env

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


module.exports = {
    host: process.env.HOST || "localhost",
    port: parseInt(process.env.PORT, 10) || 5000,
    protocol: process.env.PROTOCOL,

    api_url: process.env.HELP_REQUESTS_API_URL,
    api_key: process.env.HELP_REQUESTS_API_KEY,

    winston: {
        console: {
            file_level: process.env.WINSTON_CONSOLE_LEVEL,
            handleExceptions: process.env.WINSTON_CONSOLE_HANDLE_EXCEPTIONS,
            json: process.env.WINSTON_CONSOLE_JSON,
            colorize: process.env.WINSTON_CONSOLE_COLORIZE
        }
    }
}