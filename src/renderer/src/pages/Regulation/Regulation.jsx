import './Regulation.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import AddServiceModal from '../../components/Service/AddServiceModal'
import { getService } from '../../controllers/serviceController'
import Swal from 'sweetalert2'
import { getBrands } from '../../controllers/brandController'
import AddBrandModal from '../../components/Brand/AddBrandModal'
import { db } from '../../firebase.config'

import { useState, useEffect } from 'react'

function Regulation() {
    const [tab, setTab] = useState('service')
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)
    const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false)
    const [services, setServices] = useState([])
    const [brands, setBrands] = useState([])

    const fetchServices = async () => {
        const services = await getService()
        setServices(services)
    }

    const fetchBrands = async () => {
        const brands = await getBrands()
        setBrands(brands)
    }

    useEffect(() => {
        fetchServices()
        fetchBrands()
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
            <div className="headerr">
                <div className="btn-area">
                    <button
                        className={`tab-btn ${tab === 'service' ? 'active' : ''}`}
                        onClick={() => setTab('service')}
                    >
                        Dịch vụ
                    </button>
                    <button
                        className={`tab-btn ${tab === 'brand' ? 'active' : ''}`}
                        onClick={() => setTab('brand')}
                    >
                        Hãng xe
                    </button>
                </div>
                {JSON.parse(localStorage.getItem('currentUser'))?.role === 'admin' && (
                    <div className="z-btn-center">
                        <button
                            className="primary-button"
                            onClick={tab === 'service' ? handleAddService : handleAddBrand}
                        >
                            {tab === 'service' ? 'Thêm dịch vụ' : 'Thêm hãng xe'}
                        </button>
                    </div>
                )}
            </div>

            <div className="regulation-page__content">
                {tab === 'service' ? (
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
                            {services.map((service, index) => (
                                <tr key={service.id}>
                                    <td>{index + 1}</td>
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
                                                <div className="table__action-item">Cập nhật</div>
                                                <div className="table__action-item">Xóa</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="regulation-table page-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên hãng xe</th>
                                <th>Model</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map((brand, index) => (
                                <tr key={brand.id}>
                                    <td>{index + 1}</td>
                                    <td>{brand.name}</td>
                                    <td>{brand.model}</td>
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
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <AddServiceModal
                isOpen={isAddServiceModalOpen}
                onClose={() => setIsAddServiceModalOpen(false)}
                onSuccess={() => fetchServices()}
            />
            <AddBrandModal
                isOpen={isAddBrandModalOpen}
                onClose={() => setIsAddBrandModalOpen(false)}
                onSuccess={() => fetchBrands()}
            />
        </div>
    )
}

export default Regulation
