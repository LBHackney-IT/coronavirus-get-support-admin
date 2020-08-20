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
  console.log("Saving resident: ", resident)
  res.status(200).send(resident);
});

app.get("/help-requests", (req, res) => {
  const postcode = req.query.postcode;
  if (postcode == "E8 1DY") {
    res.status(200).send(JSON.stringify(savedResidents));
  } else if (postcode == "E9 1DY") {
    res.status(200).send(JSON.stringify([residenE91DY]));
  } else if (postcode == "E1 6PB") {
    res.status(200).send(JSON.stringify(residenE16PB));
  } else {
    res.status(200).send(JSON.stringify([]));
  }
});

app.get("/help-requests/callbacks", (req, res) => {
  res.status(200).send(JSON.stringify(savedResidents));
});

app.get("/help-requests/:id", (req, res) => {
  console.log("Requesting resident with ID: ", req.params.id)
  let found = savedResidents.filter(x=>x.Id == req.params.id)[0];

  return res.status(200).send(found);
});
app.patch("/help-requests/:id", (req, res) => {
  let found = savedResidents.filter(x=>x.Id == req.params.id)[0];
  if(found){
    let index = savedResidents.indexOf(found)
    console.log("Replacing item at index: " + index)
    // update some of the fields
    found.FirstName = req.body.FirstName
    found.LastName = req.body.LastName
    found.CallbackRequired = req.body.CallbackRequired
    found.AddressFirstLine = req.body.AddressFirstLine
    found.AddressSecondLine = req.body.AddressSecondLine
    found.PostCode = req.body.PostCode
    savedResidents[index] = found
  } else {
    console.log("Item not found with id: ", req.params.id)
  }
  return res.status(200).send(found);

});
function setRecordStatus(resident, savedResidents) {
  resident.RecordStatus = "MASTER";
}

app.listen(port, () =>
  console.log(`Fake help requests api listening on port ${port}!`)
);
