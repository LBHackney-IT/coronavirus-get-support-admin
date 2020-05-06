const jwt = require('jsonwebtoken');

const config = require('../config');

const isAuthorised = (req, res, next) => {

  const token = req.cookies[config.token_name];

  if (token) {
    let payload = null;

    try {
      payload = jwt.verify(token, config.hackney_jwt_secret);
      console.log(payload);

      const groups = payload.groups;

      if (groups && groups.includes(config.authorised_group)) {
        return next();
      } else {
        return res.status(401).redirect("login.njk", {unauthorised: true});
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
}

module.exports = isAuthorised;