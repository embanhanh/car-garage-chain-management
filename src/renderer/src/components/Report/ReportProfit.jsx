import React, { useEffect } from 'react'

function ReportProfit({ dateRange, selectedDate }) {
    useEffect(() => {
        console.log(dateRange, selectedDate)
    }, [dateRange, selectedDate])
    return (
        <div>
            <h1>ReportProfit</h1>
        </div>
    )
}

export default ReportProfit
