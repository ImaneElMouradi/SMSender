import React, { Component } from "react";

import united_remote_logo from "./images/united_remote_logo.png";
import Candidates from "./components/Candidates";
import Pagination from "./components/Pagination";
import ModalDelete from "./components/ModalDelete";

class App extends Component {
  state = {
    candidates: [],
    isLoading: false,
    search: "",
    currentPage: 1,
    candidatesPerPage: 10,
    isOpen: false
  };

  fetchApiCandidates = () => {
    this.setState({ isLoading: true });
    fetch("/api/candidates")
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
    fetch("/api/delete/" + id, {
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

  handleRefresh = () => {
    this.fetchApiCandidates();
  };

  handlePagination = number => {
    this.setState({ currentPage: number });
  };

  toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
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

    // get current candidates
    const indexOfLastCandidate =
      this.state.currentPage * this.state.candidatesPerPage;
    const indexOfFirstCandidate =
      indexOfLastCandidate - this.state.candidatesPerPage;
    const currentCandidates = filteredCandidates.slice(
      indexOfFirstCandidate,
      indexOfLastCandidate
    );

    return (
      <div className="App">
        <h4 className="navigation">
          <a href="https://unitedremote.com/companies">
            <img
              src={united_remote_logo}
              width="100"
              height="50"
              alt="United Remote Logo"
              className="logo"
            />
          </a>
          SMS Fails
        </h4>

        {/* <button onClick={this.toggleModal}>Open the modal</button>

        <ModalDelete show={this.state.isOpen} onClose={this.toggleModal}>
          <h3>Confirmation</h3> <br />
          <p>
            Do you really want to delete this record?
            <span> This process cannot be undone.</span>
          </p>
          <br />
        </ModalDelete> */}

        {this.state.isLoading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-dark" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        <div className="utility-container">
          <input
            type="text"
            value={this.state.search}
            onChange={this.handleSearch}
            placeholder="Search Name"
          />
          <span onClick={this.handleRefresh} className="refresh">
            <i className="fa fa-refresh fa-lg" />
          </span>
        </div>

        {filteredCandidates.length !== 0 && (
          <>
            <Candidates
              filteredCandidates={currentCandidates}
              handleDelete={this.handleDelete}
            />
            <Pagination
              candidatesPerPage={this.state.candidatesPerPage}
              totalCandidates={filteredCandidates.length}
              handlePagination={this.handlePagination}
              currentPage={this.state.currentPage}
            />
          </>
        )}
      </div>
    );
  }
}

export default App;
