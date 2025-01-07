import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { vi } from 'date-fns/locale'
import { format, getWeek } from 'date-fns'
import './Report.css'

import ReportRevenue from '../../components/Report/ReportRevenue'
import ReportCost from '../../components/Report/ReportCost'
import ReportProfit from '../../components/Report/ReportProfit'
import ReportComponent from '../../components/Report/ReportComponent'
import ReportCustomer from '../../components/Report/ReportCar'
import RepairRegisterReport from '../../components/Report/RepairRegisterReport'

const Report = () => {
    const [tab, setTab] = useState('revenue')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const userRole = JSON.parse(localStorage.getItem('currentUser')).role
    const currentGarage = JSON.parse(localStorage.getItem('currentGarage'))

    // Tạo ref để truy cập các methods của component con
    const revenueRef = useRef()
    const profitRef = useRef()
    const componentRef = useRef()
    const carRef = useRef()

    const handleExport = () => {
        switch (tab) {
            case 'revenue':
                userRole === 'Quản lý'
                    ? revenueRef.current?.exportToExcel?.()
                    : profitRef.current?.exportToExcel?.()
                break
            case 'component':
                componentRef.current?.exportToExcel?.()
                break
            case 'car':
                carRef.current?.exportToExcel?.()
                break

            default:
                break
        }
    }

    useEffect(() => {
        console.log('check userRole:', userRole)
    }, [userRole])

    useEffect(() => {
        console.log('check selectedDate:', selectedDate)
    }, [selectedDate])

    return (
        <div className="report-page">
            <div className="report-page__header">
                <button
                    className={`tab-btn ${tab === 'revenue' ? 'active' : ''}`}
                    onClick={() => setTab('revenue')}
                >
                    Doanh thu
                </button>
                {(userRole === 'Quản lý' || currentGarage?.id) && (
                    <>
                        <button
                            className={`tab-btn ${tab === 'component' ? 'active' : ''}`}
                            onClick={() => setTab('component')}
                        >
                            Phụ tùng
                        </button>

                        <button
                            className={`tab-btn ${tab === 'car' ? 'active' : ''}`}
                            onClick={() => setTab('car')}
                        >
                            Xe
                        </button>
                    </>
                )}
            </div>
            <div className="report-page__body mt-3 d-flex align-items-center gap-3">
                <span className="report-page__body-label">
                    {tab === 'component' ? 'Báo cáo tháng' : 'Báo cáo năm'}
                </span>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                        if (date && date <= new Date()) setSelectedDate(date)
                    }}
                    showYearPicker={tab !== 'component'}
                    showMonthYearPicker={tab === 'component'}
                    dateFormat={tab === 'component' ? 'MM/yyyy' : 'yyyy'}
                    locale={vi}
                    className="report-page__header-date w-auto form-control"
                />
                <button className="btn btn-primary" onClick={handleExport}>
                    Xuất Excel
                </button>
            </div>

            {tab === 'revenue' && (
                <>
                    {(userRole === 'Quản lý' || currentGarage?.id) && (
                        <ReportRevenue ref={revenueRef} selectedDate={selectedDate} />
                    )}
                    {userRole === 'admin' && !currentGarage?.id && (
                        <ReportProfit ref={profitRef} selectedDate={selectedDate} />
                    )}
                </>
            )}
            {tab === 'component' && (
                <ReportComponent ref={componentRef} selectedDate={selectedDate} />
            )}
            {tab === 'car' && <ReportCustomer ref={carRef} selectedDate={selectedDate} />}
        </div>
    )
}

export default Report
