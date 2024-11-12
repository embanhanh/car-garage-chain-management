import './Customer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpWideShort, faFilter, faSearch, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/Pagination'
import { useState, useMemo, useCallback } from 'react'
import ZTable from '../../components/ztable/ztable'
function Customer() {

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  function generateRandomIDNumber() {
    const regionCode = Math.floor(10 + Math.random() * 90); // Random 2-digit region code (10 to 99)
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000); // Random 10-digit number
    return `${regionCode}${randomDigits}`;
  }
  function generateRandomIDNumber() {
    const regionCode = Math.floor(10 + Math.random() * 90); // Random 2-digit region code (10 to 99)
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000); // Random 10-digit number
    return `${regionCode}${randomDigits}`;
  }
  function generateRandomEmail(name) {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const namePart = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/ /g, '').replace('đ', 'd');
    const randomNumber = Math.floor(100 + Math.random() * 900);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${namePart}${randomNumber}@${domain}`;
  }
  
  function generateRandomPhoneNumber() {
    const prefixes = ['09', '03', '07', '08', '05', '01']; // Các tiền tố phổ biến
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    let phoneNumber = prefix;
    for (let i = 0; i < 8; i++) {
      phoneNumber += Math.floor(Math.random() * 10).toString();
    }
    
    return phoneNumber;
  }
  
  // Ví dụ:
  console.log(generateRandomEmail("Nguyễn Văn An")); // nguyen.van.an123@gmail.com
  var ranname;

  const mockData = [...Array(20)].map((_, index) => ({
    id: "NV" + (index + 1).toString(),
    name: ranname = generateRandomVietnameseName(),
    email: generateRandomEmail(ranname),
    passport: generateRandomIDNumber(),
    phone: generateRandomPhoneNumber(),
    date: '22/09/2004',
    salary: generateRandomIDNumber()
  }))
  const columns = [
    { name: 'Mã KH', field: 'id', width: '8%' },
    { name: 'Họ tên', field: 'name', width: '20%' },
    { name: 'CCCD', field: 'passport', width: '15%' },
    { name: 'Email', field: 'email', width: '25%' },
    { name: 'SDT', field: 'phone', width: '10%' },
    { name: 'Ngày sinh', field: 'date', width: '10%' },
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
        <div className="page__header-search">
          <FontAwesomeIcon icon={faSearch} className="page__header-icon" />
          <input type="text" placeholder="Tìm kiếm" />
        </div>
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

export default Customer

function generateRandomVietnameseName() {
  const familyNames = [
    "Nguyễn",
    "Trần",
    "Lê",
    "Phạm",
    "Hoàng",
    "Vũ",
    "Võ",
    "Đặng",
    "Bùi",
    "Đỗ",
    "Hồ",
    "Ngô",
    "Dương",
    "Phan",
    "Vương",
    "Đinh",
    "Lý",
    "Huỳnh",
    "Nguyễn Thị",
    "Trần Thị"
  ];

  const middleNames = [
    "Văn",
    "Thị",
    "Anh",
    "Quốc",
    "Hữu",
    "Minh",
    "Thanh",
    "Đức",
    "Gia",
    "Xuân",
    "Thiện",
    "Công",
    "Hoàng",
    "Bảo",
    "Phúc"
  ];

  const givenNames = [
    "An",
    "Bình",
    "Cường",
    "Dũng",
    "Gia",
    "Hải",
    "Hòa",
    "Kiên",
    "Minh",
    "Nam",
    "Phúc",
    "Quang",
    "Sơn",
    "Tâm",
    "Thành",
    "Tuấn",
    "Vinh",
    "Yến",
    "Lan",
    "Mai",
    "Ngọc",
    "Trang",
    "Thảo",
    "Huệ",
    "Nga",
    "Hương",
    "Thủy",
    "Vy",
    "Như",
    "Bảo"
  ];

  // Chọn ngẫu nhiên họ
  const familyName = familyNames[Math.floor(Math.random() * familyNames.length)];

  // Chọn ngẫu nhiên tên đệm
  const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];

  // Chọn ngẫu nhiên tên riêng
  const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];

  // Kết hợp họ, tên đệm và tên riêng
  return `${familyName} ${middleName} ${givenName}`;
}