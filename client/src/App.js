import React, { Component } from "react";

class App extends Component {
  state = {
    candidates: [],
    isLoading: false,
    search: ""
  };

  fetchApiCandidates = () => {
    this.setState({ isLoading: true });
    fetch("http://localhost:3001/api/candidates")
      .then(response => response.json())
      .then(data => {
        this.setState({ candidates: [...data], isLoading: false });
        // console.log(this.state.candidates);
      });
  };

  componentDidMount() {
    this.fetchApiCandidates();
  }

  handleDelete = id => {
    // console.log(id);
    parseInt(id);
    fetch("http://localhost:3001/api/delete/" + id, {
      method: "DELETE"
    })
      .then(response => {
        response.json();
        this.fetchApiCandidates();
      })
      .catch(err => {
        console.log(err);
      });
    // window.location.reload();
  };

  handleSearch = e => {
    this.setState({ search: e.target.value });
  };

  render() {
    let filteredCandidates = this.state.candidates.filter(candidate => {
      return (
        candidate.candidateLastName
          .toLowerCase()
          .includes(this.state.search.toLowerCase()) ||
        candidate.candidateFirstName
          .toLowerCase()
          .includes(this.state.search.toLowerCase())
      );
    });
    return (
      <div className="App">
        <h4 className="navigation">Candidates who didn't receive an SMS</h4>
        <div className="search-container">
          <input
            type="text"
            value={this.state.search}
            onChange={this.handleSearch}
            placeholder="Search Name"
          />
        </div>
        <span>
          <i className="fa fa-redo" />
        </span>

        {this.state.isLoading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-danger" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {this.state.candidates && (
          <div>
            <table className="table table-borderless">
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
                {filteredCandidates.map(candidate => (
                  <tr key={candidate._id}>
                    <th>{candidate.candidateId}</th>
                    <td>{candidate.candidateFirstName}</td>
                    <td>{candidate.candidateLastName}</td>
                    <td>{candidate.date}</td>
                    <td
                      className={
                        candidate.problem === "no phone number"
                          ? "red"
                          : "orange"
                      }
                    >
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
          </div>
        )}
      </div>
    );
  }
}

export default App;
