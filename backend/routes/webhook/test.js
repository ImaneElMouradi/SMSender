const express = require("express");

const router = express.Router();

const saveCandidate = require("../../functions/saveCandidate");
const postCallSMS = require("../../functions/postCallSMS");

router.post("/webhook/test", (req, res) => {
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

module.exports = router;
