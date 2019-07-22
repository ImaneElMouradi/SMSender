const express = require("express");

const router = express.Router();

const Candidate = require("../../models/candidates.model");

router.get("/api/candidates", (req, res) => {
  Candidate.find((err, candidates) => {
    if (err) console.log(err);
    else res.send(candidates);
  });
});

router.delete("/api/candidates/delete/:id", (req, res) => {
  const { id } = req.params;
  Candidate.findByIdAndDelete(id, err => {
    if (err) return res.send(err);
    console.log(id + " was successfully deleted");
    res.json({ id: id, success: true });
  });
});

module.exports = router;
