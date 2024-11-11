import { useState, useMemo, useCallback } from 'react'
import {
  faArrowUpWideShort,
  faFilter,
  faSearch,
  faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Pagination from '../../components/Pagination'
import './Repair.css'
import Modal from '../../components/Modal'

const Repair = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [openReceiveRepairModal, setOpenReceiveRepairModal] = useState(false)
  const itemsPerPage = 9

  const mockData = [...Array(20)].map((_, index) => ({
    id: index + 1,
    repairId: `PCS${String(index + 1).padStart(5, '0')}`,
    staff: `Nguyễn Văn ${String.fromCharCode(65 + index)}`,
    customer: `Trần Thị ${String.fromCharCode(65 + index)}`,
    createDate: new Date(2024, 0, index + 1).toLocaleDateString('vi-VN'),
    licensePlate: `51G-${String(12345 + index).padStart(5, '0')}`,
    completionDate: new Date(2024, 0, index + 5).toLocaleDateString('vi-VN'),
    status: index % 3 === 0 ? 'Đang sửa chữa' : 'Hoàn thành'
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
    <div className="repair-page">
      <div className="repair-page__header">
        <button
          className="repair-page__header-button"
          onClick={() => setOpenReceiveRepairModal(true)}
        >
          <p>Tiếp nhận sửa chữa</p>
        </button>
        <div className="repair-page__header-filter">
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
      </div>
      <div className="repair-page__content">
        <table className="page-table repair-table">
          <thead>
            <tr>
              <th>Mã phiếu</th>
              <th>Nhân viên nhập</th>
              <th>Khách hàng</th>
              <th>Ngày tạo phiếu</th>
              <th>Biển số xe</th>
              <th>Ngày hoàn thành</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((repair, index) => (
              <tr key={repair.id}>
                <td>{repair.repairId}</td>
                <td>{repair.staff}</td>
                <td>{repair.customer}</td>
                <td>{repair.createDate}</td>
                <td>{repair.licensePlate}</td>
                <td>{repair.completionDate}</td>
                <td>
                  <div
                    className={`table__status ${repair.status === 'Đang sửa chữa' ? 'car-completed' : 'car-normal'}`}
                  >
                    {repair.status}
                  </div>
                </td>
                <td>
                  <div className="table__actions">
                    <FontAwesomeIcon icon={faEllipsisVertical} className="table__action-icon" />
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
        isOpen={openReceiveRepairModal}
        onClose={() => setOpenReceiveRepairModal(false)}
        showHeader={false}
        width="680px"
      >
        <div className="w-100 h-100 repair-modal">
          <h2 className="repair-modal__title">Thông tin khách hàng</h2>
          <div className="repair-modal__client-info">
            <div className="repair-modal__client-info-item">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <div className="input-form">
                <input type="text" id="phoneNumber" placeholder="0913123123" />
              </div>
            </div>
            <div className="repair-modal__client-info-item">
              <label htmlFor="customerName">Tên khách hàng</label>
              <div className="input-form">
                <input type="text" id="customerName" placeholder="Trần Văn A" />
              </div>
            </div>
            <div className="repair-modal__client-info-item">
              <label htmlFor="email">Email</label>
              <div className="input-form">
                <input type="text" id="email" placeholder="tranvana@gmail.com" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Repair
