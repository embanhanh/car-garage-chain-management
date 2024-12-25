// ZTable.jsx
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import './ZTable.css' // Import the CSS file with 'z' prefixed class names

const ZTable = ({ columns, data }) => {
    return (
        <table className="z-page-table z-car-table">
            <thead>
                <tr>
                    {columns.map((col, index) => (
                        <th key={index} style={{ width: col.width }}>
                            {col.name}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, rowIndex) => (
                    <tr key={item.id || rowIndex}>
                        {columns.map((col, colIndex) => {
                            if (col.field === 'actions') {
                                return (
                                    <td key={colIndex}>
                                        <div className="z-table__actions">
                                            <FontAwesomeIcon
                                                icon={faEllipsisVertical}
                                                className="z-table__action-icon"
                                            />
                                        </div>
                                    </td>
                                )
                            } else if (col.field === 'status') {
                                return (
                                    <td key={colIndex}>
                                        <span className={`z-table__status ${item.statusClass}`}>
                                            {item[col.field]}
                                        </span>
                                    </td>
                                )
                            } else {
                                return <td key={colIndex}>{item[col.field]}</td>
                            }
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ZTable
