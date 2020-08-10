const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;

app.use(cors());

const helpResponse = require("./fixtures/getAllHelpResponse.json");

app.get("/help-requests", (req, res) => {
  let postcode = req.query.postcode;
  res.set("Content-Type", "application/json");
  res.set("x-api-key", "3ZLVLTpHGx7mTFUouF1OW6OXCa4G4ilR2abdUHry");
  console.log(postcode);
  if (postcode === "E1") {
    return res.status(200).send(helpResponse);
  }
});

app.listen(port, () =>
  console.log(`Fake help requests api listening on port ${port}!`)
);
