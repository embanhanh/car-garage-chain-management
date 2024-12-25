// import './Report.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons'
// function Report() {
//     return (
//         <>
//             <div className="report-page">
//                 <div className="report-page__header">
//                     <div className="report-page__header-button-group">
//                         <button className="report-page__header-button min-w-150">
//                             <p>Doanh thu</p>
//                         </button>
//                         <button className="report-page__header-button ms-2 min-w-150">
//                             <p>Nhập kho</p>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Report

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { vi } from 'date-fns/locale'
import { format, getWeek } from 'date-fns'
import './Report.css'

import ReportRevenue from '../../components/Report/ReportRevenue'
import ReportCost from '../../components/Report/ReportCost'
import ReportProfit from '../../components/Report/ReportProfit'
import ReportStock from '../../components/Report/ReportStock'

const Report = () => {
    const [tab, setTab] = useState('revenue')
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
                <button
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
                </button>
                <button
                    className={`report-page__header-button ${tab === 'stock' ? 'active' : ''}`}
                    onClick={() => setTab('stock')}
                >
                    Nhập kho
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
                    className="w-auto"
                />
            </div>
            {tab === 'revenue' && (
                <ReportRevenue dateRange={dateRange} selectedDate={selectedDate} />
            )}
            {tab === 'cost' && <ReportCost dateRange={dateRange} selectedDate={selectedDate} />}
            {tab === 'profit' && <ReportProfit dateRange={dateRange} selectedDate={selectedDate} />}
            {tab === 'stock' && <ReportStock dateRange={dateRange} selectedDate={selectedDate} />}
        </div>
    )
}

export default Report
