const config = require('../config');

const isAuthorised = (req, res, next) => {

  const cookie = req.cookies[config.token_name];

  if (cookie) {
    console.log(cookie);

    const groups = cookie.groups;

    if (cookie.includes(config.authorised_group)) {
      return next();
    }

    // if (groups && groups.includes(config.authorised_group)) {
    //   return next();
    // }
  }

  // req.session.returnTo = req.originalUrl;
  res.render("login.njk");
}

module.exports = isAuthorised;