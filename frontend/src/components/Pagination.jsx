import React from 'react';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const buildPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pageNumbers = buildPageNumbers();

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis" aria-hidden="true">
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            className={`pagination-button${isActive ? ' active' : ''}`}
            style={
              isActive
                ? {
                    fontWeight: 700,
                    transform: 'scale(1.08)',
                    borderColor: '#1d4ed8',
                    backgroundColor: '#dbeafe',
                    color: '#1e3a8a',
                  }
                : undefined
            }
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
}
