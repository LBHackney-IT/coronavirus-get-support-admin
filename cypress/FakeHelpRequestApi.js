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
let callBackList = [];
let callBackResponse = [];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

app.post("/help-requests", (req, res) => {
  let resident = req.body;
  setRecordStatus(resident);
  savedResidents.push(resident);
  callBackList = savedResidents;
  resident.Id = getRandomInt(99);
  res.status(200).send(JSON.stringify(resident));
  savedResidents = [];
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
  callBackList.forEach((savedResident) => {
    let dateofRecordCreation = new Date(
      moment(savedResident.DateTimeRecorded)
    ).getDate();
    let today = new Date().getDate();
    if (
      today == dateofRecordCreation &&
      savedResident.RecordStatus == "MASTER"
    ) {
      callBackResponse.push(savedResident);
    }
  });
  res.status(200).send(JSON.stringify(callBackResponse));
  callBackResponse = [];
  callBackList = [];
});

app.get("/help-requests/:id", (req, res) => {
  if (req.params.id == 47) {
    return res.status(200).send(JSON.stringify(residenE91DY));
  }
});
app.patch("/help-requests/:id", (req, res) => {
  if (req.params.id == 47) {
    return res.status(200).send(JSON.stringify(residenE91DY));
  }
});
function setRecordStatus(resident, savedResidents) {
  resident.RecordStatus = "MASTER";
}

app.listen(port, () =>
  console.log(`Fake help requests api listening on port ${port}!`)
);
