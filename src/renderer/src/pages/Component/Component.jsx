import './Component.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpWideShort, faFilter, faSearch, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/Pagination'
import { useState, useMemo, useCallback } from 'react'
import ZTable from '../../components/ztable/ztable'
function Component() {

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  function randomPartCode() {
    const prefixes = ["EM", "TYRE", "SPARK", "DISC", "SHOCK", "OILFILTER", "HEADLIGHT", "RADIATOR"];
    const suffix = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    return prefixes[Math.floor(Math.random() * prefixes.length)] + suffix;
}

// 2. Hàm trả về tên phụ tùng ngẫu nhiên
function randomPartName() {
    const names = [
        "Bộ lọc gió động cơ", "Lốp Michelin 205/55R16", "Bugi NGK Iridium", "Phanh đĩa Brembo",
        "Bộ giảm xóc Monroe", "Bộ lọc dầu Mobil 1", "Đèn pha Philips X-tremeVision", "Bộ tản nhiệt Valeo"
    ];
    return names[Math.floor(Math.random() * names.length)];
}

// 3. Hàm trả về loại phụ tùng ngẫu nhiên
function randomPartType() {
    const types = ["Phụ tùng động cơ", "Lốp xe", "Phụ tùng phanh", "Phụ tùng hệ thống treo", "Phụ tùng chiếu sáng", "Phụ tùng làm mát"];
    return types[Math.floor(Math.random() * types.length)];
}

// 4. Hàm trả về số lượng ngẫu nhiên (từ 50 đến 200)
function randomQuantity() {
    return Math.floor(Math.random() * 151) + 50;
}

// 5. Hàm trả về đơn giá ngẫu nhiên (từ 80,000 đến 4,000,000 VND)
function randomPrice() {
    const prices = [80000, 150000, 900000, 1500000, 1800000, 2200000, 4000000];
    return `₫ ${prices[Math.floor(Math.random() * prices.length)].toLocaleString()}`;
}

// 6. Hàm trả về kho hàng ngẫu nhiên
function randomWarehouse() {
    const warehouses = ["B1", "B2", "B3"];
    return warehouses[Math.floor(Math.random() * warehouses.length)];
}

  const mockData = [...Array(20)].map((_, index) => ({
    cnt: index + 1,
    id: randomPartCode(),
    name: randomPartName(),
    type: randomPartType(),
    amount: randomQuantity(),
    price: randomPrice(),
    store: randomWarehouse()
  }))
  const columns = [
    { name: 'Thứ tự', field: 'cnt', width: '10%' },
    { name: 'Mã phụ tùng', field: 'id', width: '20%' },
    { name: 'Tên phụ tùng', field: 'name', width: '30%' },
    { name: 'Loại phụ tùng', field: 'type', width: '20%' },
    { name: 'Số lượng', field: 'amount', width: '15%' },
    { name: 'Đơn giá', field: 'price', width: '15%' },
    { name: 'Kho hàng', field: 'store', width: '15%' },
    { name: '', field: 'actions', width: '5%' },
  ];
  
  // const data = [
  //   {
  //     id: '001',
  //     name: 'Nguyen Van A',
  //     email: 'a@example.com',
  //     passport: '123456789',
  //     sex: 'Nam',
  //     position: 'Nhân viên',
  //     salary: '10,000,000 VND',
  //   },
  //   // ... more data items
  // ];

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
    <div className="main-container">
      <div className="headerr">
      <div className="btn-area">
          <button className="addBtn">Kho Phụ Tùng</button>
          <button className="addAccBtn">Phiếu Nhập Kho</button>
        </div>
        <div className="z-btn-center-buy">
        <button className="addBtn">Mua Hàng</button>
        </div>

        <div className="filter-area">
          <button className="page__header-button">
          <FontAwesomeIcon icon={faArrowUpWideShort} className="page__header-icon" />
          Sắp xếp
        </button>
        <button className="page__header-button">
          <FontAwesomeIcon icon={faFilter} className="page__header-icon" />
          Lọc
        </button>
        </div>
      </div>
      <div className="employee-table">
      <div className="z-car-page">
      <div className="z-car-page__header">
        {/* Header content here */}
      </div>
      <div className="z-car-page__content">
        <ZTable columns={columns} data={currentData} />
      </div>
    </div >
      <div className='z-pagination'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      </div>
      
    </div>
  )
}

export default Component