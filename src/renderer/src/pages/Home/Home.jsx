import { useNavigate } from 'react-router-dom'
import './Home.css'
import { useEffect } from 'react'
import { dbService } from '../../services/DatabaseService'

function Home() {
    const nav = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const users = await dbService.getAll('users')
        }
        fetchData()
    }, [])

    return (
        <>
            <div className="home-page d-flex flex-column gap-3 p-3  h-100">
                <div className="home-page__overview w-100 p-3">
                    <h1 className="home-page__title">Tổng quan</h1>
                    <div className="row " style={{ justifyContent: 'space-between' }}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div className="home-page__overview-item" key={index}>
                                <div className="home-page__overview-item-label">
                                    <p
                                        style={{
                                            fontSize: '1.4rem',
                                            color: '#858D9D',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Hôm nay
                                    </p>
                                    <p
                                        style={{
                                            fontSize: '1.6rem',
                                            color: '#5D6679',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Sửa chữa
                                    </p>
                                </div>
                                <p
                                    className="home-page__overview-item-value"
                                    style={{
                                        fontSize: '2.6rem',
                                        color: '#5030E5',
                                        fontWeight: '600'
                                    }}
                                >
                                    100
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="home-page__content row">
                    <div className="home-page__content-client col-8 p-3 d-flex flex-column gap-3">
                        <h1 className="home-page__title">Khách hàng gần đây</h1>

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
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>Khách hàng {index + 1}</td>
                                            <td>Dịch vụ {index + 1}</td>
                                            <td>Trạng thái {index + 1}</td>
                                            <td>Chi phí {index + 1}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="home-page__content-notification col-4 p-3 d-flex flex-column gap-3">
                        <h1 className="home-page__title">Thông báo</h1>
                        <div className="home-page__content-notification-body scrollbar p-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div className="home-page__notification-item">
                                    <div className="home-page__notification-item-header">
                                        <p
                                            style={{
                                                fontSize: '1.6rem',
                                                color: '#333',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Thông báo 1
                                        </p>
                                        <p
                                            style={{
                                                fontSize: '1.2rem',
                                                color: '#5D6679',
                                                fontWeight: '600'
                                            }}
                                        >
                                            1 phút trước
                                        </p>
                                    </div>
                                    <div className="home-page__notification-item-body">
                                        <p
                                            style={{
                                                fontSize: '1.4rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Họp vào lúc 10h30 sáng ngày 30/11/2024.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
