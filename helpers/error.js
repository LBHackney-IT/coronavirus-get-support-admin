const logger = require('../middleware/logger');

class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
      this.is404 = statusCode ? 404 || true : false;
    }
  }

  const handleError = (err, req, res) => {
    const { statusCode, message, is404 } = err;
    
    logger.error(`${statusCode || 500} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(statusCode || 500);
    
    res.render('error.njk', {
        error: {
            status: statusCode || 500,
            is404: is404 || false,
            message: message || 'Internal Server Error',
        }
    });
  };

  const handleAPIErrors = (error) => {
    let errorResponse;

    if(error.response && error.response.data) {
      // I expect the API to handle error responses in valid format
      errorResponse = error.response.data;
      // JSON stringify if you need the json and use it later
    } else if(error.request) {
      // TO Handle the default error response for Network failure or 404 etc.,
      errorResponse = error.request.message || error.request.statusText;
    } else {
      errorResponse = error.message;
    }
    
    throw new Error(errorResponse);
  }

  module.exports = {
    ErrorHandler,
    handleError,
    handleAPIErrors
  }