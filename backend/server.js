const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");

// const request = require("request");
const request = require("retry-request", {
  request: require("request")
}); // default we have 3 tries

const fs = require("fs");
const util = require("util");

const logFile = fs.createWriteStream("log.txt", { flags: "a" });
const logStdout = process.stdout;

// overwrite console.log to save logs
console.log = e => {
  logFile.write(util.format(e) + "\n");
  logStdout.write(util.format(e) + "\n");
};

const token = "8gNuELeWoqeiIisOBRyQw2cNu";
const sender = "itwins"; // you can add in the API /&shortcode=${sender}/
// normal API // https://bulksms.ma/developer/sms/send?token=${token}&tel=${phoneNum}&message=${message}

const message = "test bulksms ma";

const testUrl = "https://engeknzgmobav.x.pipedream.net/testSMS";

const mongoose = require("mongoose");
let Candidate = require("./candidates.model");

mongoose.connect(
  "mongodb://localhost:27017/CandidatesFailSMS",
  { useNewUrlParser: true },
  err => {
    if (err) console.log(err);
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("Connection successfull to database");
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const opts = {
  retries: 4
};

// functions
const postCallTest = (res, phoneNum) => {
  request(
    {
      url: testUrl,
      method: "POST",
      json: true
      // maxAttempts: 5,
      // retryDelay: 5000,
      // retryStrategy: request.RetryStrategies.HTTPOrNetworkError // retry on errors 5xx and network errors
    },
    opts,
    (err, response, body) => {
      if (response) {
        // console.log("The number of request attempts: " + response.attempts); // works with requestretry but had problem with it...
        res.send("send SMS to " + phoneNum);
      }
      if (err) return console.log(err);
    }
  );
};

// fucntion to store candidates depending on the pb (problem) encountered
saveCandidate = (pb, id, first_name, last_name, res) => {
  const date = new Date();
  const candidate = new Candidate({
    candidateId: id,
    candidateFirstName: first_name,
    candidateLastName: last_name,
    problem: pb,
    date:
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
  });
  candidate.save((err, candidate) => {
    if (err) return console.error(err);
    res.send(candidate.candidateId + " saved to the database : " + pb);
  });
};

// endpoint
app.post("/test", (req, res) => {
  //   console.log(req.body);
  //   res.status(200).send(req.body.payload.application.candidate);
  if (req.body.action === "candidate_stage_change") {
    const {
      id,
      first_name,
      last_name,
      phone_numbers
    } = req.body.payload.application.candidate;
    // const phoneNum = phone_numbers[0].value;
    if (phone_numbers) {
      const phoneNum = phone_numbers[0].value; // have to check if the number is valid (format etc)
      if (phoneNum.length != 10 || phoneNum[0] != "0") {
        saveCandidate("wrong number", id, first_name, last_name, res);
      } else {
        postCallTest(res, phoneNum);
      }

      // return res.send("send SMS to " + phoneNum);
    } else {
      saveCandidate("no phone number", id, first_name, last_name, res);
    }
  }
});

app.get("/api/candidates", (req, res) => {
  Candidate.find((err, candidates) => {
    if (err) consloe.log(err);
    else res.send(candidates);
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
