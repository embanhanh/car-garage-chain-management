import React, { useEffect } from 'react'

function ReportCost({ dateRange, selectedDate }) {
    useEffect(() => {
        console.log(dateRange, selectedDate)
    }, [dateRange, selectedDate])
    return (
        <div>
            <h1>ReportCost</h1>
        </div>
    )
}

export default ReportCost
