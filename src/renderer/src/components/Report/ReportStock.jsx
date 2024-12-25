import React from 'react'

function ReportStock({ dateRange, selectedDate }) {
    return (
        <div>
            <h1>ReportStock</h1>
            <h1>{dateRange}</h1>
            <h1>{selectedDate}</h1>
        </div>
    )
}

export default ReportStock
