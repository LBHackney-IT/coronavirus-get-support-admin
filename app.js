const config = require("./config");
const loaders = require("./loaders");
const logger = require("./middleware/logger");
const worker = require("./src/mocks/browser.js");

const express = require("express");
if (process.env.NODE_ENV === "development") {
  worker.start();
}
async function startServer() {
  const app = express();

  await loaders.init({ expressApp: app });

  app.listen(config.port, (err) => {
    if (err) {
      logger.error(`${err}`);

      return;
    }
    console.log(`Your server is ready !`);
    logger.info("Listening on port: " + config.port);
  });
}

startServer();
