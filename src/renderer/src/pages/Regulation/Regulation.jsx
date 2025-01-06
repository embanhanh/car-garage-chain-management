import './Regulation.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import AddServiceModal from '../../components/Service/AddServiceModal'
import { getService } from '../../controllers/serviceController'
import Swal from 'sweetalert2'
import Pagination from '../../components/Pagination'

import { useState, useEffect } from 'react'

function Regulation() {
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)
    const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false)
    const [services, setServices] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7 // Số dịch vụ trên mỗi trang

    const fetchServices = async () => {
        const services = await getService()
        setServices(services)
    }

    useEffect(() => {
        fetchServices()
    }, [])

    const handleAddService = () => {
        setIsAddServiceModalOpen(true)
    }

    const handleAddBrand = () => {
        setIsAddBrandModalOpen(true)
    }

    // Tính toán dữ liệu cho trang hiện tại
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return services.slice(startIndex, endIndex)
    }

    // Xử lý thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <div className="regulation-page">
            <div className="regulation-page__header">
                <button className="primary-button" onClick={handleAddService}>
                    Thêm dịch vụ
                </button>
                <button className="primary-button" onClick={handleAddBrand}>
                    Thêm hãng xe
                </button>
            </div>
            <div className="regulation-page__content">
                <div className="regulation-page__body">
                    <div className="regulation-page__header-service col-8">
                        <table className="regulation-table page-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên dịch vụ</th>
                                    <th>Loại dịch vụ</th>
                                    <th>Thời gian thực hiện</th>
                                    <th>Giá</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCurrentPageData().map((service, index) => (
                                    <tr key={service.id}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{service.name}</td>
                                        <td>{service.serviceType?.name || ''}</td>
                                        <td>{service.duration}</td>
                                        <td>{service.price?.toLocaleString('vi-VN')}đ</td>
                                        <td className="overflow-visible">
                                            <div className="table__actions">
                                                <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                    className="table__action-icon"
                                                />
                                                <div className="table__action-menu">
                                                    <div className="table__action-item">
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

                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(services.length / itemsPerPage)}
                            onPageChange={handlePageChange}
                        />
                    </div>
                    <div className="regulation-page__header-service col-4">
                        <table className="regulation-table page-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên hãng xe</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Toyota</td>
                                    <td className="overflow-visible">
                                        <div className="table__actions">
                                            <FontAwesomeIcon
                                                icon={faEllipsisVertical}
                                                className="table__action-icon"
                                            />
                                            <div className="table__action-menu">
                                                <div className="table__action-item">Cập nhật</div>
                                                <div className="table__action-item">Xóa</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <AddServiceModal
                isOpen={isAddServiceModalOpen}
                onClose={() => setIsAddServiceModalOpen(false)}
                onSuccess={() => fetchServices()}
            />
            {isAddBrandModalOpen && <AddBrandModal onClose={() => setIsAddBrandModalOpen(false)} />}
        </div>
    )
}

export default Regulation
