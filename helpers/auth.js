const config = require('../config');

const isAuthorised = (req, res, next) => {

  console.log('Cookies: ', req.cookies);
  console.log('Signed Cookies: ', req.signedCookies);

  const cookie = req.cookies[config.token_name];

  if (cookie) {
    console.log(cookie);

    const groups = cookie.groups;

    if (groups && groups.includes(config.authorised_group)) {
      return next();
    }
  }

  res.render("login.njk");
}

module.exports = isAuthorised;