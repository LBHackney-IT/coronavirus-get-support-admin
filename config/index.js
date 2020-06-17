require('dotenv').config(); // this loads the defined variables from .env

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    host: process.env.HOST || "localhost",
    port: parseInt(process.env.PORT, 10) || 5000,
    protocol: process.env.PROTOCOL,
    local: process.env.LOCAL,

    api_url: process.env.HELP_REQUESTS_API_URL,
    api_key: process.env.HELP_REQUESTS_API_KEY,

    annex_summary_api_url: process.env.ANNEX_SUMMARY_API_URL,

    delivery_api_url: process.env.DELIVERY_SCHEDULE_API_URL,
    delivery_batch_api_url: process.env.DELIVERY_BATCH_API_URL,

    authorised_user_group: process.env.AUTHORISED_USER_GROUP,
    authorised_admin_group: process.env.AUTHORISED_ADMIN_GROUP,
    token_name: process.env.TOKEN_NAME,
    hackney_jwt_secret: process.env.HACKNEY_JWT_SECRET,

    winston: {
        console: {
            file_level: process.env.WINSTON_CONSOLE_LEVEL,
            handleExceptions: process.env.WINSTON_CONSOLE_HANDLE_EXCEPTIONS,
            json: process.env.WINSTON_CONSOLE_JSON,
            colorize: process.env.WINSTON_CONSOLE_COLORIZE
        }
    }
}