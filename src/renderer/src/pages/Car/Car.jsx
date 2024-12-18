import { useState, useMemo, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowUpWideShort,
    faFilter,
    faSearch,
    faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/Pagination'
import Modal from '../../components/Modal'
import UpDetailCarModal from '../../components/Car/UpDetailCarModal'
import './Car.css'

const Car = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [carDetail, setCarDetail] = useState({
        show: false,
        data: null,
        type: 'detail'
    })
    const itemsPerPage = 8

    const mockData = [...Array(57)].map((_, index) => ({
        id: index + 1,
        licensePlate: `51G-${String(12345 + index).padStart(5, '0')}`,
        model: index % 2 === 0 ? 'Camry' : 'Civic',
        brand: index % 2 === 0 ? 'Toyota' : 'Honda',
        year: 2020 + (index % 5),
        owner: `Nguyễn Văn ${String.fromCharCode(65 + index)}`,
        status: index % 2 === 0 ? 'Đang sửa chữa' : 'Hoàn thành'
    }))

    const totalPages = Math.ceil(mockData.length / itemsPerPage)

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return mockData.slice(start, start + itemsPerPage)
    }, [currentPage, mockData])

    const handlePageChange = useCallback(
        (page) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page)
            }
        },
        [totalPages]
    )

    return (
        <div className="car-page d-flex flex-column gap-3 pb-3">
            <div className="car-page__header">
                <button className="page__header-button">
                    <FontAwesomeIcon icon={faArrowUpWideShort} className="page__header-icon" />
                    Sắp xếp
                </button>
                <button className="page__header-button">
                    <FontAwesomeIcon icon={faFilter} className="page__header-icon" />
                    Lọc
                </button>
                <div className="page__header-search">
                    <FontAwesomeIcon icon={faSearch} className="page__header-icon" />
                    <input type="text" placeholder="Tìm kiếm" />
                </div>
            </div>
            <div className="car-page__content">
                <table className="page-table car-table">
                    <thead>
                        <tr>
                            <th>Thứ tự</th>
                            <th>Biển số xe</th>
                            <th>Mẫu xe</th>
                            <th>Hãng xe</th>
                            <th>Năm sản xuất</th>
                            <th>Tên chủ xe</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((car, index) => (
                            <tr key={car.id}>
                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{car.licensePlate}</td>
                                <td>{car.model}</td>
                                <td>{car.brand}</td>
                                <td>{car.year}</td>
                                <td>{car.owner}</td>
                                <td>
                                    <div
                                        className={`table__status ${car.status === 'Đang sửa chữa' ? 'car-repairing' : 'car-normal'}`}
                                    >
                                        {car.status}
                                    </div>
                                </td>
                                <td className="overflow-visible">
                                    <div className="table__actions">
                                        <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                            className="table__action-icon"
                                        />
                                        <div
                                            className={`table__action-menu ${
                                                (index + 1) % itemsPerPage === 0 ? 'show-top' : ''
                                            }`}
                                        >
                                            <div
                                                className="table__action-item"
                                                onClick={() =>
                                                    setCarDetail({
                                                        show: true,
                                                        data: car,
                                                        type: 'detail'
                                                    })
                                                }
                                            >
                                                Chi tiết
                                            </div>
                                            <div
                                                className="table__action-item"
                                                onClick={() => {
                                                    setCarDetail({
                                                        show: true,
                                                        data: car,
                                                        type: 'update'
                                                    })
                                                }}
                                            >
                                                Cập nhật
                                            </div>
                                            <div className="table__action-item">Xóa</div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <Modal
                isOpen={carDetail.show}
                onClose={() => setCarDetail({ show: false, data: null })}
                showHeader={false}
                width="520px"
            >
                <UpDetailCarModal
                    onClose={() => setCarDetail({ show: false, data: null })}
                    data={carDetail.data}
                    onSave={() => {}}
                    type={carDetail.type}
                />
            </Modal>
        </div>
    )
}

export default Car
