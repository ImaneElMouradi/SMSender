const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Candidates = new Schema({
  candidateId: {
    type: Number
  },
  candidateFirstName: {
    type: String
  },
  candidateLastName: {
    type: String
  },
  problem: {
    type: String
  },
  date: {
    type: String
  }
  //   candidatePhoneNumber: {
  //     type: String
  //   }
});

module.exports = mongoose.model("Candidates", Candidates);
