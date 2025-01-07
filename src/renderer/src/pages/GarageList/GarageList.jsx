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
import { db } from '../../firebase.config'
import './GarageList.css'
import Sidebar from '../../layout/sidebar.jsx'
import Header from '../../layout/Header.jsx'
import { useNavigate } from 'react-router-dom'
import bg1 from '../../assets/images/background/bg_1.jpg'
import bg2 from '../../assets/images/background/bg_2.jpg'
import bg3 from '../../assets/images/background/bg_3.jpg'
import bg4 from '../../assets/images/background/bg_4.jpg'

function GarageList() {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [garageData, setGarageData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const itemsPerPage = 8

    const backgroundImages = [bg1, bg2, bg3, bg4]
    
    const getRandomBackground = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * backgroundImages.length)
        return backgroundImages[randomIndex]
    }, [])

    const fetchData = async () => {
        const data = await dbService.getAll('garages')
        setGarageData(data)
    }

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'garages'), async (snapshot) => {
            await fetchData()
        })
        return () => unsub()
    }, [])

    const searchGarages = useMemo(() => {
        if (!searchTerm) return garageData

        const searchLower = searchTerm.toLowerCase().trim()
        return garageData.filter(
            (garage) =>
                garage.name?.toLowerCase().includes(searchLower) ||
                garage.address?.toLowerCase().includes(searchLower) ||
                garage.phone?.includes(searchLower)
        )
    }, [garageData, searchTerm])

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return searchGarages.slice(start, start + itemsPerPage)
    }, [currentPage, searchGarages])

    const totalPages = Math.ceil(searchGarages.length / itemsPerPage)

    const handlePageChange = useCallback(
        (page) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page)
            }
        },
        [totalPages]
    )

    const handleGarageClick = (garage) => {
        localStorage.setItem('currentGarage', JSON.stringify(garage))
        navigate('/dashboard')
    }

    return (
        <div className="main-layout">
            <Sidebar />
            <Header />
            <div className="main-content">
                <div className="garage-page">
                    <div className="garage-page__header">
                        <div className="page__header-search ">
                            <FontAwesomeIcon icon={faSearch} className="page__header-icon" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, địa chỉ, số điện thoại..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="garage-grid">
                        {currentData.map((garage) => (
                            <div
                                key={garage.id}
                                className="garage-card"
                                onClick={() => handleGarageClick(garage)}
                                style={{ backgroundImage: `url(${getRandomBackground()})` }}
                            >
                                <h2>{garage.name}</h2>
                                <p>
                                    <strong>Địa chỉ:</strong> {garage.address}
                                </p>
                                <p>
                                    <strong>Điện thoại:</strong> {garage.phone}
                                </p>
                                {/* <div className="garage-card-actions">
                                    <FontAwesomeIcon
                                        icon={faEllipsisVertical}
                                        className="action-icon"
                                    />
                                    <div className="action-menu">
                                        <div className="action-item">Chi tiết</div>
                                        <div className="action-item">Cập nhật</div>
                                        <div className="action-item">Xóa</div>
                                    </div>
                                </div> */}
                            </div>
                        ))}
                    </div>
                    <div className="garage-page__pagination">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GarageList
