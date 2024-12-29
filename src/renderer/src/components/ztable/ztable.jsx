// ZTable.jsx
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import './ZTable.css' // Import the CSS file with 'z' prefixed class names

const ZTable = ({ columns, data, addAccount = () => {}, detailAction = () => {} }) => {
    const itemsPerPage = 12
    return (
        <table className="z-page-table z-car-table overflow-visible">
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
                                    <td key={colIndex} className="overflow-visible">
                                        <div className="table__actions">
                                            <FontAwesomeIcon
                                                icon={faEllipsisVertical}
                                                className="table__action-icon"
                                            />
                                            <div
                                                className={`table__action-menu ${
                                                    (colIndex + 1) % itemsPerPage === 0
                                                        ? 'show-top'
                                                        : ''
                                                }`}
                                            ></div>
                                            <div
                                                className={`table__action-menu ${
                                                    (colIndex + 1) % itemsPerPage === 0
                                                        ? 'show-top'
                                                        : ''
                                                }`}
                                            >
                                                {"hasAccount" in item && !item.hasAccount ? (
                                                    <div
                                                        className="table__action-item"
                                                        onClick={() => addAccount({
                                                            idNV: item.id,
                                                            role: item.position
                                                        })}
                                                    >
                                                        Tạo tài khoản
                                                    </div>
                                                ) : null}
                                                <div
                                                    className="table__action-item"
                                                    onClick={() => {
                                                        detailAction(item)
                                                    }}
                                                >
                                                    Chi tiết
                                                </div>
                                                <div
                                                    className="table__action-item"
                                                    onClick={() => {}}
                                                >
                                                    Cập nhật
                                                </div>
                                                <div
                                                    className="table__action-item"
                                                    onClick={async () => {}}
                                                >
                                                    Xóa
                                                </div>
                                            </div>
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
