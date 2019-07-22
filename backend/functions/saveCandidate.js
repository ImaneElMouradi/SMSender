let Candidate = require("../models/candidates.model");

const postSlack = require("./postSlack");

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
        const date = new Date();
        Candidate.findOneAndUpdate(
          { candidateId: id },
          {
            problem: pb,
            date:
              date.getDate() +
              "-" +
              (date.getMonth() + 1) +
              "-" +
              date.getFullYear()
          },
          { upsert: true, useFindAndModify: false },
          (err, doc) => {
            if (err) return res.send(500, { error: err });
            postSlack(id, first_name, last_name, pb);

            return res.send(
              candidate.candidateId + " saved to the database (update) : " + pb
            );
          }
        );
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send();
    });
};

module.exports = saveCandidate;
