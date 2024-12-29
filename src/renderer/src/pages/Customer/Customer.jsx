import './Customer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowUpWideShort,
    faFilter,
    faSearch,
    faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/Pagination'
import { useState, useMemo, useCallback, useEffect } from 'react'
import ZTable from '../../components/ztable/ztable'
import Modal from '../../components/Modal'
import AddCustomer from './add_customer'
import { dbService } from '../../services/DatabaseService.js'
import { doc, onSnapshot, collection } from 'firebase/firestore'
import { db } from '../../firebase.config'
import DetailCustomer from './detail_customer.jsx'
import DialogConfirmDialog from '../../components/dialog_confirm_dialog.jsx'

function Customer() {
    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenEdit, setIsOpenEdit] = useState(false)
    const [isOpenDetail, setIsOpenDetail] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)

    const [customer, selecteCustomer] = useState({})
    const [listCustomers, setListCustomers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    const columns = [
        { name: 'Mã KH', field: 'id', width: '8%' },
        { name: 'Họ tên', field: 'name', width: '20%' },
        { name: 'CCCD', field: 'identifyCard', width: '15%' },
        { name: 'Email', field: 'email', width: '25%' },
        { name: 'SDT', field: 'phone', width: '10%' },
        { name: 'Ngày sinh', field: 'birthday', width: '10%' },
        { name: '', field: 'actions', width: '5%' }
    ]

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

    const totalPages = Math.ceil(listCustomers.length / itemsPerPage)

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return listCustomers.slice(start, start + itemsPerPage)
    }, [currentPage, listCustomers])

    const fetchData = async () => {
        const data = await dbService.getAll('customers')

        setListCustomers(data)
        console.log('check data customers:', data)
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'customers'), async (snapshot) => {
            await fetchData()
        })
        return () => unsubscribe()
    }, [])

    const handlePageChange = useCallback(
        (page) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page)
            }
        },
        [totalPages]
    )

    const handleEdit = (kh) => {
        selecteCustomer(kh)
        setIsOpenEdit(true)
    }
    const handleDetail = (kh) => {
        selecteCustomer(kh)
        setIsOpenDetail(true)
    }
    const handleDelete = (kh) => {
        selecteCustomer(kh)
        setIsOpenDelete(true)
    }
    return (
        <div className="main-container">
            <div className="headerr">
                <div className="btn-area"></div>

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
                    <div className="z-car-page__header">{/* Header content here */}</div>
                    <div className="z-car-page__content">
                        <ZTable
                            detailAction={handleDetail}
                            editAction={handleEdit}
                            deleteAction={handleDelete}
                            columns={columns}
                            data={currentData}
                        />
                    </div>
                </div>
                <div className="z-pagination">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <Modal
                isOpen={isOpenEdit}
                onClose={() => setIsOpenEdit(false)}
                showHeader={false}
                width="680px"
            >
                <AddCustomer
                    onClose={() => setIsOpenEdit(false)}
                    kh={customer}
                    isEdit={true}
                ></AddCustomer>
            </Modal>
            <Modal
                isOpen={isOpenDetail}
                onClose={() => setIsOpenDetail(false)}
                showHeader={false}
                width="680px"
            >
                <DetailCustomer
                    onClose={() => setIsOpenDetail(false)}
                    nv={customer}
                ></DetailCustomer>
            </Modal>
            <DialogConfirmDialog
                isShow={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                message="Bạn có chắn chắn muốn xoá khách hàng này"
                onConfirm={async () => {
                    await dbService.softDelete('customers', customer.id)
                    setIsOpenDelete(false)
                }}
            ></DialogConfirmDialog>
        </div>
    )
}

export default Customer
