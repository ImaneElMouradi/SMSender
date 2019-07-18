import React, { Component } from "react";

class Candidates extends Component {
  getColor = e => {
    if (e.match("no phone number")) {
      return "redCol";
    } else if (e === "Wrong number") {
      return "orangeCol";
    } else {
      return "blueCol";
    }
  };
  render() {
    return (
      <table className="table table-borderless table-striped ">
        <thead className="">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scopr="col">Date</th>
            <th scope="col">Problem</th>
            <th scope="col" />
          </tr>
        </thead>

        <tbody>
          {this.props.filteredCandidates.map(candidate => (
            <tr key={candidate._id}>
              <th>{candidate.candidateId}</th>
              <td>{candidate.candidateFirstName}</td>
              <td>{candidate.candidateLastName}</td>
              <td>{candidate.date}</td>
              <td className={this.getColor(candidate.problem)}>
                {candidate.problem}
              </td>
              <td>
                <span onClick={() => this.handleDelete(candidate._id)}>
                  <i className="fa fa-trash trash" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default Candidates;