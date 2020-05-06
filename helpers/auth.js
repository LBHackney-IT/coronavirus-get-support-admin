const jwt = require('jsonwebtoken');

const config = require('../config');

const isAuthorised = (req, res, next) => {

  return next();
  
  const token = req.cookies[config.token_name];

  res.locals.returnURL = req.protocol + '://' + req.hostname;

  if (token) {
    let payload = null;

    try {
      payload = jwt.verify(token, config.hackney_jwt_secret);
      const groups = payload.groups;

      if (groups && groups.includes(config.authorised_group)) {
        return next();
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