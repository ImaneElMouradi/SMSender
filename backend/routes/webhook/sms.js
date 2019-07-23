const express = require("express");

const router = express.Router();

const send_SMS = require("../../functions/index");

// endpoints for mixmax webhook

router.post("/sms/send_quiz", (req, res) => {
  // this endpoint is for the quiz phase
  const message =
    "Congratulations! You have been selected to move to the next step of the hiring process at United Remote. We kindly ask that you complete one of the short tech quizzes sent to you on your email address.  ";
  send_SMS(message, req, res);
});

router.post("/sms/send_challenge", (req, res) => {
  // this endpoint is for the challenge phase
  const message =
    "Congratulations! You have been selected to move to the 2nd step in the journey to join United Remote. Please check your email address for the coding challenge";
  send_SMS(message, req, res);
});

module.exports = router;
