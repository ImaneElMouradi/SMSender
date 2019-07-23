import React, { Component } from "react";

import united_remote_logo from "./images/united_remote_logo.png";
import Candidates from "./components/Candidates";
import Pagination from "./components/Pagination";
import Modal from "./components/Modal";

class App extends Component {
  state = {
    candidates: [],
    isLoading: false,
    search: "",
    currentPage: 1,
    candidatesPerPage: 10,
    isOpen: false,
    candidateId: null
  };

  fetchApiCandidates = async () => {
    try {
      this.setState({ isLoading: true });

      const response = await fetch("/api/candidates");
      const data = await response.json();

      this.setState({ candidates: [...data] });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  componentDidMount() {
    this.fetchApiCandidates();
  }

  handleDelete = async () => {
    try {
      await fetch(`/api/candidates/delete/${this.state.candidateId}`, {
        method: "DELETE"
      });

      this.toggleModal();
      this.fetchApiCandidates();
    } catch (err) {
      console.log(err);
    }
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
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  handleModal = id => () => {
    this.toggleModal();
    this.setState({ candidateId: id });
  };

  render() {
    const filteredCandidates = this.state.candidates.filter(
      candidate =>
        candidate.candidateLastName
          .toLowerCase()
          .includes(this.state.search.toLowerCase()) ||
        candidate.candidateFirstName
          .toLowerCase()
          .includes(this.state.search.toLowerCase())
    );

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
              width="50"
              height="25"
              alt="United Remote Logo"
              className="logo"
            />
          </a>
          {"SMS Fails"}
        </h4>

        {this.state.isOpen && (
          <Modal onClose={this.toggleModal} onConfirm={this.handleDelete}>
            <h3>Confirmation</h3>
            <br />
            <p>
              Do you really want to delete this record?
              <span> This process cannot be undone.</span>
            </p>
            <br />
          </Modal>
        )}

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

        {!!filteredCandidates.length && (
          <>
            <Candidates
              filteredCandidates={currentCandidates}
              handleDelete={this.handleDelete}
              handleModal={this.handleModal}
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
