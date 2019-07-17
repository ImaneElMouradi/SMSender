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

// overwrite console.log to save logs in log.txt and on console(default)
console.log = e => {
  logFile.write(util.format(e) + "\n");
  logStdout.write(util.format(e) + "\n");
};

const token = "8gNuELeWoqeiIisOBRyQw2cNu";
const sender = "itwins"; // you can add in the API /&shortcode=${sender}/
// normal API // https://bulksms.ma/developer/sms/send?token=${token}&tel=${phoneNum}&message=${message}

const message = "test bulksms ma";

// url used for tetsing purposes only
const testUrl = "https://ennn27uyxhe2.x.pipedream.net/testSMS";

// incoming webhook in order to send messages to slack channel (real time)
const slackWebhook =
  "https://hooks.slack.com/services/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";

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

// retry request 5 times before reject (err)
const opts = {
  retries: 4
};

// functions

// function to send SMS - uses bulksms.ma (mock for now) - 5 tries
const postCallSMS = (res, phoneNum, id, first_name, last_name) => {
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
      if (err) {
        console.log(
          `sms fail to ${id} ${last_name} ${first_name}, error: ${err}`
        );
        saveCandidate("5xx or Network err", id, first_name, last_name, res);
      }
    }
  );
};

module.exports.postCallSMS = postCallSMS;

// funciton to send a real time message to slack whenever an SMS fails
const postSlack = (id, first_name, last_name, pb) => {
  var payload = {
    text:
      "*Failed to send SMS* :persevere:\n" +
      "*Candidate ID:* " +
      id +
      "\n" +
      "*First Name:* " +
      first_name +
      "\n" +
      "*Last Name:* " +
      last_name +
      "\n" +
      "*Problem:* " +
      pb +
      "\n" +
      "--> For more details, please <http://localhost:3000| click here>"
  };
  payload = JSON.stringify(payload);

  request({ url: slackWebhook, body: payload, method: "POST" }, (err, data) => {
    if (data) console.log(`the message to slack is ${data.body}`);
    if (err) console.log(err);
  });
};

// function to store candidates depending on the problem encountered in mongodb database
const saveCandidate = (pb, id, first_name, last_name, res) => {
  const date = new Date();

  // checks if the candidateID already exists
  Candidate.findOne({ candidateId: id })
    .then(candidate => {
      if (!candidate) {
        const candidate = new Candidate({
          candidateId: id,
          candidateFirstName: first_name,
          candidateLastName: last_name,
          problem: pb,
          date:
            date.getDate() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getFullYear()
        });
        candidate.save((err, candidate) => {
          if (err) return console.error(err);
          postSlack(id, first_name, last_name, pb);
          res.send(candidate.candidateId + " saved to the database : " + pb);
        });
      } else {
        // updating if candidate exists
        candidate.problem = pb;
        candidate.date = date;
        res.send(
          candidate.candidateId + " saved to the database (update) : " + pb
        );
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send();
    });
};

// endpoint (of the 3rd party's webhook)
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
        saveCandidate("Wrong number", id, first_name, last_name, res);
      } else {
        postCallSMS(res, phoneNum, id, first_name, last_name);
      }

      // return res.send("send SMS to " + phoneNum);
    } else {
      saveCandidate("no phone number", id, first_name, last_name, res);
    }
  }
});

// api used by front-end app
app.get("/api/candidates", (req, res) => {
  Candidate.find((err, candidates) => {
    if (err) consloe.log(err);
    else res.send(candidates);
  });
});

app.delete("/api/delete/:id", (req, res) => {
  const { id } = req.params;
  Candidate.findByIdAndDelete(id, err => {
    if (err) return res.send(err);
    console.log(id + " was successfully deleted");
    res.json({ id: id, success: true });
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
