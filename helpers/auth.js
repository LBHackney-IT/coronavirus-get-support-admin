const jwt = require('jsonwebtoken');

const config = require('../config');

const isAuthorised = (req, res, next) => {
  const token = req.cookies[config.token_name];

  res.locals.returnURL = req.protocol + '://' + req.hostname;

  if (token) {
    let payload = null;

    try {
      const isAuthorised = false;

      payload = jwt.verify(token, config.hackney_jwt_secret);
      const groups = payload.groups;

      req.auth = {
        name: payload.name,
        isAdmin: false
      }

      if (groups) {
        if(groups.includes(config.authorised_group) || groups.includes(config.authorised_admin_group)) {
          isAuthorised = true;
        };
        
        if(groups.includes(config.authorised_admin_group)) {
          req.auth.isAdmin = true;
        }

        if (isAuthorised) {
          return next();
        }        
      }

    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
          return res.status(401).redirect("login.njk");
        } else {
          const error = new Error(err);

          return next(error);
        }
    } 
  }

  return res.render("login.njk");
}

module.exports = isAuthorised;