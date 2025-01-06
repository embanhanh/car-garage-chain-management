import { useState, useMemo, useCallback, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowUpWideShort,
    faFilter,
    faSearch,
    faEllipsisVertical,
    faCaretDown,
    faArrowUp,
    faArrowDown
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
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('desc');
    const [filters, setFilters] = useState({
        brand: 'all',
        year: 'all'
    });
    const [originalCars, setOriginalCars] = useState([]);

    const fetchData = async () => {
        const data = await dbService.getAll('cars')
        setCarData(data)
        setOriginalCars(data)
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

    const handleSort = (field) => {
        let newDirection;
        if (field === sortField) {
            if (sortDirection === 'desc') {
                newDirection = 'asc';
            } else {
                setSortField(null);
                setSortDirection('desc');
                setCarData([...originalCars]);
                return;
            }
        } else {
            newDirection = 'desc';
        }

        setSortField(field);
        setSortDirection(newDirection);

        const sorted = [...carData].sort((a, b) => {
            if (!a[field] || !b[field]) return 0;

            if (field === 'manufacturingYear') {
                return newDirection === 'desc' 
                    ? b[field] - a[field] 
                    : a[field] - b[field];
            }

            const valueA = String(a[field] || '').toLowerCase();
            const valueB = String(b[field] || '').toLowerCase();
            return newDirection === 'desc' 
                ? valueB.localeCompare(valueA)
                : valueA.localeCompare(valueB);
        });

        setCarData(sorted);
    };

    const handleFilter = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));

        if (value === 'all') {
            setCarData([...originalCars]);
            return;
        }

        const filtered = originalCars.filter((car) => {
            switch (type) {
                case 'brand':
                    return car.brand === value;
                case 'year':
                    const currentYear = new Date().getFullYear();
                    const age = currentYear - car.manufacturingYear;
                    switch (value) {
                        case 'under3':
                            return age < 3;
                        case '3to7':
                            return age >= 3 && age <= 7;
                        case 'over7':
                            return age > 7;
                        default:
                            return true;
                    }
                default:
                    return true;
            }
        });

        setCarData(filtered);
    };

    return (
        <div className="car-page d-flex flex-column gap-3 pb-3">
            <div className="car-page__header">
                <div className="dropdown">
                    <button className={`page__header-button ${sortField ? 'active' : ''}`}>
                        <FontAwesomeIcon icon={faArrowUpWideShort} className="page__header-icon" />
                        Sắp xếp{' '}
                        {sortField && 
                            `(${sortField === 'manufacturingYear' ? 'Năm SX' : 'STT'} ${sortDirection === 'asc' ? '↑' : '↓'})`}
                        <FontAwesomeIcon icon={faCaretDown} className="page__header-icon" />
                    </button>
                    <div className="dropdown-content">
                        <div>
                            <h4 className="filter-title">Sắp xếp theo</h4>
                            <button onClick={() => handleSort('manufacturingYear')}>
                                Năm sản xuất
                                {sortField === 'manufacturingYear' && (
                                    <FontAwesomeIcon 
                                        icon={sortDirection === 'asc' ? faArrowUp : faArrowDown} 
                                        className="sort-direction-icon" 
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="dropdown">
                    <button className={`page__header-button ${(filters.brand !== 'all' || filters.year !== 'all') ? 'active' : ''}`}>
                        <FontAwesomeIcon icon={faFilter} className="page__header-icon" />
                        Lọc{' '}
                        {filters.brand !== 'all' && `(${filters.brand})`}
                        {filters.year !== 'all' && 
                            `${filters.brand !== 'all' ? ', ' : '('}${
                                filters.year === 'under3' ? '2021-2024' :
                                filters.year === '3to7' ? '2017-2020' :
                                'Trước 2017'
                            }${filters.brand === 'all' ? ')' : ')'}`}
                        <FontAwesomeIcon icon={faCaretDown} className="page__header-icon" />
                    </button>
                    <div className="dropdown-content">
                        <div className="filter-section">
                            <h4 className="filter-title">Hãng xe</h4>
                            <button onClick={() => handleFilter('brand', 'all')}>
                                Tất cả
                                {filters.brand === 'all' && (
                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                )}
                            </button>
                            {['Toyota', 'Honda', 'Ford', 'Hyundai'].map(brand => (
                                <button key={brand} onClick={() => handleFilter('brand', brand)}>
                                    {brand}
                                    {filters.brand === brand && (
                                        <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="filter-section">
                            <h4 className="filter-title">Năm sản xuất</h4>
                            <button onClick={() => handleFilter('year', 'all')}>
                                Tất cả
                                {filters.year === 'all' && (
                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                )}
                            </button>
                            <button onClick={() => handleFilter('year', 'under3')}>
                                2021-2024
                                {filters.year === 'under3' && (
                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                )}
                            </button>
                            <button onClick={() => handleFilter('year', '3to7')}>
                                2017-2020
                                {filters.year === '3to7' && (
                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                )}
                            </button>
                            <button onClick={() => handleFilter('year', 'over7')}>
                                Trước 2017
                                {filters.year === 'over7' && (
                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
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
                showHeader={false}
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
