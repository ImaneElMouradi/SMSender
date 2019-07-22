const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const date = new Date();

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
    default:
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
  }
  //   candidatePhoneNumber: {
  //     type: String
  //   }
});

module.exports = mongoose.model("Candidates", Candidates);
