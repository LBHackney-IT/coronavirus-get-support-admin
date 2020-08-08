const rest = require("msw");
const config = require("../../config/index");
const response = require("../../cypress/fixtures/getAllHelpResponse.json");

const handlers = [
  rest.get(config.help_requests_api_url, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(response));
  }),
  // rest.get("http://localhost:5000", (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json(response));
  // }),
];

module.exports = {
  handlers,
};
