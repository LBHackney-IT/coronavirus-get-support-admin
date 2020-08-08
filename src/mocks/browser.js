const setupWorker = require("msw");
const handlers = require("./handlers.js");

const worker = setupWorker(...handlers);

module.exports = {
  worker,
};
