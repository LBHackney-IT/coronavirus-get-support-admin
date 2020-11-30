const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const moment = require("moment");
const residenE91DY = require("./fixtures/resident_E91DY.json");
const residenE16PB = require("./fixtures/resident_E16PB.json");
const addresses = require("./fixtures/addresses.json");
const { query } = require("../middleware/logger");
const { post } = require("request");
let savedResidents = [];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

app.post("/help-requests", (req, res) => {
  let resident = req.body;
  setRecordStatus(resident);
  savedResidents.push(resident);
  resident.Id = getRandomInt(99) + 1;
  console.log("Saving resident: ", resident.Id);
  res.status(200).send(resident);
});
app.post("/help-requests/:id/calls", (req, res) => {
  res.status(200);
});
app.get("/help-requests", (req, res) => {
  const postcode = req.query.postcode;
  console.log("Filter resident by Postcode: ", postcode);
  let filterByPostcodeResults = savedResidents.filter(
    (x) => x.PostCode == postcode
  );
  res.status(200).send(filterByPostcodeResults);
});

app.get("/help-requests/callbacks", (req, res) => {
  console.log("Get callbacks");
  let callbacksToDo = savedResidents.filter(
    (x) => x.InitialCallbackCompleted == false || x.CallbackRequired == true
  );
  res.status(200).send(callbacksToDo);
});

app.get("/help-requests/:id", (req, res) => {
  console.log("Requesting resident with ID: ", req.params.id);
  let found = savedResidents.filter((x) => x.Id == req.params.id)[0];

  return res.status(200).send(found);
});
app.patch("/help-requests/:id", (req, res) => {
  let found = savedResidents.filter((x) => x.Id == req.params.id)[0];
  if (found) {
    let index = savedResidents.indexOf(found);
    console.log("Replacing item at index: " + index);
    // update some of the fields
    found.FirstName = req.body.FirstName;
    found.LastName = req.body.LastName;
    found.CallbackRequired = req.body.CallbackRequired;
    found.InitialCallbackCompleted = req.body.InitialCallbackCompleted;
    found.AddressFirstLine = req.body.AddressFirstLine;
    found.AddressSecondLine = req.body.AddressSecondLine;
    found.PostCode = req.body.PostCode;
    savedResidents[index] = found;
  } else {
    console.log("Item not found with id: ", req.params.id);
  }
  return res.status(200).send(found);
});

app.get("/addresses", (req, res) => {
  console.log("Requesting resident addresses: ", req.query.postcode);

  const filteredObject = JSON.parse(JSON.stringify(addresses));
  filteredObject.data.address = addresses.data.address.filter(
    (address) => address.postcode == req.query.postcode
  );

  return res.status(200).send(filteredObject);
});

function setRecordStatus(resident, savedResidents) {
  resident.RecordStatus = "MASTER";
}

app.listen(port, () =>
  console.log(`Fake help requests api listening on port ${port}!`)
);
