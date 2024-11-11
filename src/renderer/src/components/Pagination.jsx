import { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPaginationButtons = () => {
    const buttons = []
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      )
    }
    return buttons
  }

  return (
    <div className="pagination">
      <button
        className="pagination-button__nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '10px' }} />
        Trang Trước
      </button>
      <div className="pagination-buttons">{renderPaginationButtons()}</div>
      <button
        className="pagination-button__nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Trang Kế
        <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: '10px' }} />
      </button>
    </div>
  )
}

export default memo(Pagination)
