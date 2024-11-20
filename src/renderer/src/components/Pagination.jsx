import { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPaginationButtons = () => {
        const buttons = []
        const showMax = 6 // Số nút tối đa hiển thị

        if (totalPages <= showMax) {
            // Nếu tổng số trang ít hơn showMax thì hiện tất cả
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
        } else {
            // Luôn hiển thị trang đầu
            buttons.push(
                <button
                    key={1}
                    className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
                    onClick={() => onPageChange(1)}
                >
                    1
                </button>
            )

            // Tính toán range của các nút giữa
            let startPage = Math.max(2, currentPage - Math.floor((showMax - 3) / 2))
            let endPage = Math.min(totalPages - 1, startPage + showMax - 4)

            // Điều chỉnh lại startPage nếu endPage đã chạm giới hạn
            startPage = Math.max(2, endPage - (showMax - 4))

            // Hiển thị dấu ... bên trái
            if (startPage > 2) {
                buttons.push(
                    <span key="left-dots" className="pagination-dots">
                        ...
                    </span>
                )
            }

            // Thêm các nút ở giữa
            for (let i = startPage; i <= endPage; i++) {
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

            // Hiển thị dấu ... bên phải
            if (endPage < totalPages - 1) {
                buttons.push(
                    <span key="right-dots" className="pagination-dots">
                        ...
                    </span>
                )
            }

            // Luôn hiển thị trang cuối
            buttons.push(
                <button
                    key={totalPages}
                    className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
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
