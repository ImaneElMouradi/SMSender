const express = require("express");

const router = express.Router();

const saveCandidate = require("../../functions/saveCandidate");
const postCallSMS = require("../../functions/postCallSMS");

const request = require("retry-request", {
  request: require("request")
}); // default we have 3 tries

// retry request 5 times before reject (err)
const opts = {
  retries: 4
};

const recruiteeKey = require("../../config/keys").recruiteeKey;

// endpoint for mixmax webhook
router.post("/webhook/test", (req, res) => {
  // we get the candidate's email from mixmax webhook
  const candidateEmail = req.body.to[0].email;
  console.log(candidateEmail);

  // we use the email to send an http get request to recruitee to get other data
  // then we send SMS if phone number is available and correct
  request(
    {
      headers: {
        Authorization: recruiteeKey
      },
      url: `https://api.recruitee.com/c/38130/search/new/quick?query=${candidateEmail}`,
      method: "GET",
      json: true
    },
    opts,
    (err, resp, body) => {
      if (resp) {
        const { id, name, phones } = body.candidates.hits[0];
        // or just change db model to "name" and functions params
        const first_name = name.split(" ")[0];
        const last_name = name.split(" ")[1];
        console.log(
          `Received details about candidate whose email is ${candidateEmail}`
        );
        if (phones[0]) {
          const phoneNum = phones[0]; // have to check if the number is valid (format etc)
          if (phoneNum.length != 10 || phoneNum[0] != "0") {
            saveCandidate("Wrong number", id, first_name, last_name, res);
          } else {
            postCallSMS(res, phoneNum, id, first_name, last_name);
          }
        } else {
          saveCandidate("no phone number", id, first_name, last_name, res);
        }
      }
      if (err)
        console.log(
          `Error in fetching candidate (email: ${candidateEmail}) data in Recruitee: ${err}`
        );
    }
  );
});

module.exports = router;
