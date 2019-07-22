import React from "react";

export default function Pagination({
  candidatesPerPage,
  totalCandidates,
  handlePagination,
  currentPage
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalCandidates / candidatesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers.map(number => (
          <li
            key={number}
            className={
              number === currentPage ? "page-item active" : "page-item"
            }
          >
            <a
              href="#!"
              onClick={() => handlePagination(number)}
              className="page-link"
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
