const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Candidates = new Schema({
  candidateId: {
    type: Number,
    required: true
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
    type: String,
    default: Date.now
  }
  //   candidatePhoneNumber: {
  //     type: String
  //   }
});

module.exports = mongoose.model("Candidates", Candidates);
