import { useNavigate } from 'react-router-dom'
import './Home.css'
import { useEffect, useState } from 'react'
import { dbService } from '../../services/DatabaseService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons'
import { getRecentRepairRegisters } from '../../controllers/repairController'
import { getRecentServiceRegisters } from '../../controllers/serviceRegisterController'
import { getBillsByGarageId } from '../../controllers/billController'
import { onSnapshot, collection } from 'firebase/firestore'
import Modal from '../../components/Modal'
import { db } from '../../firebase.config'

function Home() {
    const nav = useNavigate()

    const [recentServices, setRecentServices] = useState([])
    const [notifications, setNotifications] = useState([])
    const [addNotification, setAddNotification] = useState(false)
    const [notification, setNotification] = useState({
        title: '',
        content: '',
        garageId: JSON.parse(localStorage.getItem('currentGarage'))?.id
    })
    const [processedData, setProcessedData] = useState([
        {
            customerName: '',
            serviceName: '',
            status: '',
            cost: 0
        }
    ])

    const [overviewData, setOverviewData] = useState([
        {
            title: 'Doanh thu',
            subtitle: 'Hôm nay',
            value: 0,
            color: '#5030E5'
        },
        {
            title: 'Đơn sửa chữa',
            subtitle: 'Đang thực hiện',
            value: 0,
            color: '#FFA500'
        },
        {
            title: 'Khách hàng',
            subtitle: 'Tổng số',
            value: 0,
            color: '#00A36C'
        },
        {
            title: 'Phụ tùng',
            subtitle: 'Sắp hết hàng',
            value: 0,
            color: '#FF0000'
        },
        {
            title: 'Nhân viên',
            subtitle: 'Đang làm việc',
            value: 0,
            color: '#1E90FF'
        }
    ])

    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        const services = await getRecentServiceRegisters()
        setRecentServices(services)
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'notifications'), (snapshot) => {
            setNotifications(
                snapshot.docs
                    .map((doc) => doc.data())
                    .filter(
                        (notification) =>
                            notification.garageId ===
                            JSON.parse(localStorage.getItem('currentGarage'))?.id
                    )
            )
        })
        return () => unsubscribe()
    }, [])

    const processData = () => {
        let processedData = []

        // Xử lý phiếu dịch vụ
        console.log('check recentServices:', recentServices)
        recentServices.forEach((serviceRegister) => {
            // Với mỗi dịch vụ trong repairRegisters
            console.log('check serviceRegister:', serviceRegister)
            serviceRegister.repairRegisters?.forEach((repair) => {
                console.log('check repair:', repair)
                let cost = 0
                if (repair.service?.price) {
                    cost = repair.service?.price
                } else {
                    // console.log('check components:', repair.repairRegisterComponents)
                    cost = repair.repairRegisterComponents.reduce((total, item) => {
                        return total + item.quantity * item.component.price
                    }, 0)
                }
                processedData.push({
                    customerName: serviceRegister.car?.customer?.name || 'Không có tên',
                    serviceName: repair.service?.name || 'Chưa có dịch vụ',
                    status: repair.status || 'Chưa xác định',
                    cost: cost
                })
            })
        })

        // Nếu không có dữ liệu, trả về mảng với một phần tử mặc định
        if (processedData.length === 0) {
            return [
                {
                    customerName: '',
                    serviceName: '',
                    status: '',
                    cost: 0
                }
            ]
        }

        // Sắp xếp theo thời gian và lấy 5 dịch vụ gần nhất
        return processedData.slice(0, 5)
    }

    useEffect(() => {
        if (recentServices.length > 0) {
            setProcessedData(processData())
        }
    }, [recentServices])

    useEffect(() => {
        const fetchOverviewData = async () => {
            setIsLoading(true)
            try {
                // Lấy doanh thu hôm nay
                const today = new Date()
                const bills = await getBillsByGarageId(
                    JSON.parse(localStorage.getItem('currentGarage'))?.id,
                    today,
                    today
                )
                const todayRevenue = bills.reduce(
                    (total, bill) => total + (bill.totalAmount || 0),
                    0
                )

                // Lấy số đơn sửa chữa đang thực hiện
                const repairs = await dbService.getAll('serviceregisters')
                const inProgressRepairs = repairs.filter(
                    (repair) => repair.status === 'Đang thực hiện'
                ).length

                // Lấy tổng số khách hàng
                const customers = await dbService.getAll('customers')

                // Lấy số phụ tùng sắp hết hàng (inventory < 10)
                const components = await dbService.getAll('components')
                const lowStockComponents = components.filter(
                    (comp) => (comp.inventory || 0) < 10
                ).length

                // Lấy số nhân viên đang làm việc
                const employees = await dbService.getAll('employees')
                const activeEmployees = employees.length

                setOverviewData([
                    { ...overviewData[0], value: todayRevenue },
                    { ...overviewData[1], value: inProgressRepairs },
                    { ...overviewData[2], value: customers.length },
                    { ...overviewData[3], value: lowStockComponents },
                    { ...overviewData[4], value: activeEmployees }
                ])
            } catch (error) {
                console.error('Error fetching overview data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOverviewData()
    }, [])

    return (
        <>
            <div className="home-page d-flex flex-column gap-3 p-3  h-100">
                <div className="home-page__overview w-100 p-3">
                    <h1 className="home-page__title">Tổng quan</h1>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                        {isLoading ? (
                            <div className="d-flex justify-content-center w-100">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </div>
                            </div>
                        ) : (
                            overviewData.map((item, index) => (
                                <div className="home-page__overview-item" key={index}>
                                    <div className="home-page__overview-item-label">
                                        <p
                                            style={{
                                                fontSize: '1.4rem',
                                                color: '#858D9D',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {item.subtitle}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: '1.6rem',
                                                color: '#5D6679',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {item.title}
                                        </p>
                                    </div>
                                    <p
                                        className="home-page__overview-item-value"
                                        style={{
                                            fontSize: '2.6rem',
                                            color: item.color,
                                            fontWeight: '600',
                                            lineHeight: 1
                                        }}
                                    >
                                        {item.title === 'Doanh thu'
                                            ? new Intl.NumberFormat('vi-VN', {
                                                  style: 'currency',
                                                  currency: 'VND'
                                              }).format(item.value)
                                            : item.value}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="home-page__content row">
                    <div className="home-page__content-client col-8 p-3 d-flex flex-column gap-3">
                        <h1 className="home-page__title">Khách hàng gần đây</h1>
                        {isLoading ? (
                            <div className="d-flex justify-content-center w-100">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="home-page__content-client-body">
                                <table className="home-page__content-client-table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên khách hàng</th>
                                            <th>Dịch vụ</th>
                                            <th>Trạng thái</th>
                                            <th>Chi phí</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {processedData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.customerName}</td>
                                                <td>{item.serviceName}</td>
                                                <td>
                                                    <span
                                                        className={`status-badge ${
                                                            item.status === 'Đã hoàn thành'
                                                                ? 'completed'
                                                                : item.status === 'Đang thực hiện'
                                                                  ? 'in-progress'
                                                                  : 'pending'
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(item.cost)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="home-page__content-notification col-4 p-3 d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h1 className="home-page__title">Thông báo</h1>
                            {(JSON.parse(localStorage.getItem('currentUser'))?.role === 'Quản lý' ||
                                JSON.parse(localStorage.getItem('currentUser'))?.role ===
                                    'admin') && (
                                <FontAwesomeIcon
                                    onClick={() => {
                                        setAddNotification(true)
                                    }}
                                    icon={faCalendarPlus}
                                    className="icon-add-notification"
                                />
                            )}
                        </div>
                        <div className="home-page__content-notification-body scrollbar p-1">
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => (
                                    <div className="home-page__notification-item" key={index}>
                                        <p
                                            style={{
                                                fontSize: '1.6rem',
                                                color: '#333',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {notification.title}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: '1.2rem',
                                                color: '#5D6679',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {new Intl.DateTimeFormat('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: '2-digit',
                                                month: 'numeric',
                                                year: 'numeric'
                                            }).format(new Date(notification.createdAt))}
                                        </p>
                                        <div className="home-page__notification-item-body">
                                            <p
                                                style={{
                                                    fontSize: '1.4rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {notification.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="d-flex justify-content-center w-100">
                                    <p>Không có thông báo</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={addNotification}
                onClose={() => setAddNotification(false)}
                title="Thêm thông báo"
                showHeader={true}
                width="600px"
            >
                <div className="d-flex flex-column gap-3">
                    <div className="row">
                        <div className="col-12">
                            <label className="label-for-input" htmlFor="">
                                Tiêu đề
                            </label>
                            <div className="input-form">
                                <input
                                    className="w-100"
                                    type="text"
                                    placeholder="Nhập tiêu đề"
                                    value={notification.title}
                                    onChange={(e) => {
                                        setNotification((pre) => ({
                                            ...pre,
                                            title: e.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="label-for-input" htmlFor="">
                                Nội dung
                            </label>
                            <div className="input-form">
                                <textarea
                                    className="w-100"
                                    placeholder="Nhập nội dung"
                                    value={notification.content}
                                    rows={5}
                                    onChange={(e) => {
                                        setNotification((pre) => ({
                                            ...pre,
                                            content: e.target.value
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="page-btns end">
                        <button
                            className="page__header-button"
                            onClick={() => setAddNotification(false)}
                        >
                            Hủy
                        </button>
                        <button
                            disabled={false}
                            className="primary-button"
                            onClick={async () => {
                                await dbService.add('notifications', notification)
                                setAddNotification(false)
                            }}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Home
