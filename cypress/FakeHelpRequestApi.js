const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;
const config = require("../config/index");
app.use(cors());

const helpResponse = require("./fixtures/allHelpRequestsResponse.json");
const emptyHelpResponse = require("./fixtures/emptyHelpRequestsResponse.json");
const callbackResponse = require("./fixtures/callbackHelpRequestResponse.json");
const helpRequestResponse = require("./fixtures/helpRequestResponse.json");

app.get("/help-requests", (req, res) => {
  const postcode = req.query.postcode;
  res.set("Content-Type", "application/json");
  res.set("x-api-key", config.help_requests_api_key);
  console.log(postcode);
  if (postcode === "E1") {
    return res.status(200).send(helpResponse);
  } else if (postcode !== "E1") {
    return res.status(200).send(emptyHelpResponse);
  }
});
app.get("/help-requests", (req, res) => {
  const postcode = req.query.postcode;
  res.set("Content-Type", "application/json");
  res.set("x-api-key", config.help_requests_api_key);
  console.log(postcode);
  if (postcode === "E1") {
    return res.status(200).send(helpResponse);
  } else if (postcode !== "E1") {
    return res.status(200).send(emptyHelpResponse);
  }
});
app.get("/help-requests/callbacks", (req, res) => {
  const master = req.query.master;
  res.set("Content-Type", "application/json");
  res.set("x-api-key", config.help_requests_api_key);
  if (master === "true") {
    return res.status(200).send(callbackResponse);
  }
});
app.get("/help-requests/:id", (req, res) => {
  return res.status(200).send(helpRequestResponse);
});

app.listen(port, () =>
  console.log(`Fake help requests api listening on port ${port}!`)
);
