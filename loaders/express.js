const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const nunjucks  = require('nunjucks');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const config = require('../config');
const indexRoutes = require('../routes/index');
const helpRequestsRoutes = require('../routes/help_requests');
const logger = require('../middleware/logger');
const { handleError } = require('../helpers/error');

module.exports = {
    init: async ( app ) => {
        //----------------------
        // Configuration
        //----------------------

        if (!process.env.LOCAL) {
            function requireHTTPS(req, res, next) {
              // The 'x-forwarded-proto' check is for Heroku
              if (
                !req.secure &&
                req.get("x-forwarded-proto") !== "https" &&
                process.env.NODE_ENV !== "development"
              ) {
                return res.redirect("https://" + req.get("host") + req.url);
              }
              next();
            }
          
            app.use(requireHTTPS);
        }

        app.use(cookieParser(config.hackney_jwt_secret));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(helmet());
        app.use(compression());

        app.use(morgan(
            ':method :url :status :response-time ms', 
            { stream: logger.stream }
        ));

        const _templates = [
            'views/',
            'node_modules/lbh-frontend/lbh/',
            'node_modules/lbh-frontend/lbh/components/',
            'node_modules/govuk-frontend/govuk/',
            'node_modules/govuk-frontend/govuk/components/'
        ];

        nunjucks.configure( _templates, {
            autoescape: true,
            cache: false,
            express: app
        } ) ;

        app.set('views', path.join(__dirname, 'views'));

        // Set Nunjucks as rendering engine for pages with .html suffix
        app.engine( 'njk', nunjucks.render ) ;
        app.set( 'view engine', 'html' ) ;

        app.use(express.static(path.join(__dirname, '../public')));
        app.use('/assets', express.static('node_modules/lbh-frontend/lbh/assets'));
        app.use('/assets', express.static('node_modules/govuk-frontend/govuk/assets'));


        //-------------------------
        // Route Handlers
        //-------------------------

        app.use('/help-requests', helpRequestsRoutes);

        app.get("/:page", function(req, res) {
            res.locals.query = req.query;
            res.render(req.params.page);
        });

        app.use('/', indexRoutes);


        //-------------------------
        // Error Handlers
        //-------------------------

        app.use((req, res, next) => {
            const error = new Error();

            error.message = "Page not found";
            error.statusCode = 404;
            error.is404 = true;

            next(error);
        });

        app.use((err, req, res, next) => {
            handleError(err, req, res);
          });
    }
}