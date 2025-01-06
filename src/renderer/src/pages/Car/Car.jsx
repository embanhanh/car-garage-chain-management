import { useState, useMemo, useCallback, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowUpWideShort,
    faFilter,
    faSearch,
    faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'
import { onSnapshot, collection } from 'firebase/firestore'
import { dbService } from '../../services/DatabaseService'
import Pagination from '../../components/Pagination'
import Modal from '../../components/Modal'
import UpDetailCarModal from '../../components/Car/UpDetailCarModal'
import { db } from '../../firebase.config'
import './Car.css'

const Car = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [carDetail, setCarDetail] = useState({
        show: false,
        data: null,
        type: 'detail'
    })
    const [carData, setCarData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const itemsPerPage = 8

    const fetchData = async () => {
        const data = await dbService.getAll('cars')
        setCarData(data)
    }
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'cars'), async (snapshot) => {
            await fetchData()
        })
        return () => unsub()
    }, [])

    const searchCars = useMemo(() => {
        if (!searchTerm) return carData

        const searchLower = searchTerm.toLowerCase().trim()

        return carData.filter((car) => {
            // Kiểm tra biển số xe (loại bỏ khoảng trắng và dấu -)
            const normalizedLicensePlate = car.licensePlate?.replace(/[\s-]/g, '').toLowerCase()
            const normalizedSearch = searchLower.replace(/[\s-]/g, '')
            if (normalizedLicensePlate?.includes(normalizedSearch)) {
                return true
            }

            // Kiểm tra mã xe (format XExxxx)
            if (searchLower.startsWith('xe')) {
                return car.id.toLowerCase().includes(searchLower)
            }

            // Kiểm tra năm sản xuất
            if (/^\d{4}$/.test(searchLower)) {
                return car.manufacturingYear?.toString().includes(searchLower)
            }

            // Kiểm tra hãng xe và mẫu xe
            if (
                car.brand?.toLowerCase().includes(searchLower) ||
                car.model?.toLowerCase().includes(searchLower)
            ) {
                return true
            }

            // Kiểm tra tên chủ xe
            if (car.customer?.name?.toLowerCase().includes(searchLower)) {
                return true
            }

            // Mặc định tìm theo tất cả
            return (
                car.id.toLowerCase().includes(searchLower) ||
                (car.licensePlate || '').toLowerCase().includes(searchLower) ||
                (car.brand || '').toLowerCase().includes(searchLower) ||
                (car.model || '').toLowerCase().includes(searchLower) ||
                (car.manufacturingYear || '').toString().includes(searchLower) ||
                (car.customer?.name || '').toLowerCase().includes(searchLower)
            )
        })
    }, [carData, searchTerm])

    // Cập nhật currentData để sử dụng kết quả tìm kiếm
    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return searchCars.slice(start, start + itemsPerPage)
    }, [currentPage, searchCars])

    // Cập nhật totalPages
    const totalPages = Math.ceil(searchCars.length / itemsPerPage)

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
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo biển số, mã xe, hãng xe, mẫu xe, năm SX, chủ xe..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                            {/* <th>Trạng thái</th> */}
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
                                <td>{car.manufacturingYear}</td>
                                <td>{car.customer?.name}</td>
                                {/* <td></td>
                                    <div
                                        className={`table__status ${car.status === 'Đang sửa chữa' ? 'car-repairing' : 'car-normal'}`}
                                    >
                                        {car.status}
                                    </div>
                                </td> */}
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
                                            {(JSON.parse(localStorage.getItem('currentUser'))
                                                ?.role == 'admin' ||
                                                JSON.parse(localStorage.getItem('currentUser'))
                                                    ?.role == 'Quản lý') && (
                                                <div
                                                    className="table__action-item"
                                                    onClick={async () => {
                                                        await dbService.softDelete('cars', car.id)
                                                    }}
                                                >
                                                    Xóa
                                                </div>
                                            )}
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
                showHeader={true}
                title={
                    carDetail.type === 'detail'
                        ? 'Chi tiết xe'
                        : carDetail.type === 'update'
                          ? 'Cập nhật xe'
                          : 'Thêm xe'
                }
                width="520px"
            >
                <UpDetailCarModal
                    onClose={() => setCarDetail({ show: false, data: null })}
                    data={carDetail.data}
                    type={carDetail.type}
                />
            </Modal>
        </div>
    )
}

export default Car
