import React, { useState, useEffect, useMemo, useCallback } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { vi } from 'date-fns/locale'
import { format, getWeek } from 'date-fns'
import './Report.css'

import ReportRevenue from '../../components/Report/ReportRevenue'
import ReportCost from '../../components/Report/ReportCost'
import ReportProfit from '../../components/Report/ReportProfit'
import ReportStock from '../../components/Report/ReportStock'
import ReportCustomer from '../../components/Report/ReportCustomer'
import RepairRegisterReport from '../../components/Report/RepairRegisterReport'

const Report = () => {
    const [tab, setTab] = useState('stock')
    const [dateRange, setDateRange] = useState('week')
    const [selectedDate, setSelectedDate] = useState(new Date())

    const formatWeekLabel = (date) => {
        const weekNumber = getWeek(date, { weekStartsOn: 1 })
        const year = format(date, 'yyyy')
        return `Tuần ${weekNumber}, ${year}`
    }

    useEffect(() => {
        console.log(tab)
    }, [tab])

    return (
        <div className="report-page">
            <div className="report-page__header">
                <button
                    className={`report-page__header-button ${tab === 'revenue' ? 'active' : ''}`}
                    onClick={() => setTab('revenue')}
                >
                    Doanh thu
                </button>
                {/* <button
                    className={`report-page__header-button ${tab === 'cost' ? 'active' : ''}`}
                    onClick={() => setTab('cost')}
                >
                    Chi phí
                </button>
                <button
                    className={`report-page__header-button ${tab === 'profit' ? 'active' : ''}`}
                    onClick={() => setTab('profit')}
                >
                    Lợi nhuận
                </button> */}
                <button
                    className={`report-page__header-button ${tab === 'stock' ? 'active' : ''}`}
                    onClick={() => setTab('stock')}
                >
                    Nhập kho
                </button>
                <button
                    className={`report-page__header-button ${tab === 'customer' ? 'active' : ''}`}
                    onClick={() => setTab('customer')}
                >
                    Khách hàng
                </button>
                <button
                    className={`report-page__header-button ${tab === 'repair' ? 'active' : ''}`}
                    onClick={() => setTab('repair')}
                >
                    Phiếu sửa chữa
                </button>
            </div>
            <div className="report-page__body mt-3">
                <select
                    className="report-page__body-select w-auto"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                >
                    <option value="week">Theo tuần</option>
                    <option value="month">Theo tháng</option>
                    <option value="year">Theo năm</option>
                </select>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                        if (date && date <= new Date()) setSelectedDate(date)
                    }}
                    dateFormat={
                        dateRange === 'week'
                            ? "'" + formatWeekLabel(selectedDate) + "'"
                            : dateRange === 'month'
                              ? 'MM/yyyy'
                              : 'yyyy'
                    }
                    showWeekPicker={dateRange === 'week'}
                    showMonthYearPicker={dateRange === 'month'}
                    showYearPicker={dateRange === 'year'}
                    locale={vi}
                    className="report-page__header-date w-auto"
                />
            </div>
            {tab === 'revenue' && (
                <ReportRevenue dateRange={dateRange} selectedDate={selectedDate} />
            )}
            {tab === 'cost' && <ReportCost dateRange={dateRange} selectedDate={selectedDate} />}
            {tab === 'profit' && <ReportProfit dateRange={dateRange} selectedDate={selectedDate} />}
            {tab === 'stock' && <ReportStock dateRange={dateRange} selectedDate={selectedDate} />}
            {tab === 'customer' && (
                <ReportCustomer dateRange={dateRange} selectedDate={selectedDate} />
            )}
            {tab === 'repair' && (
                <RepairRegisterReport dateRange={dateRange} selectedDate={selectedDate} />
            )}
        </div>
    )
}

export default Report
