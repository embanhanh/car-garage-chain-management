import './Regulation.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

function Regulation() {
    return (
        <div className="regulation-page">
            <div className="regulation-page__header">
                <button className="primary-button">Thêm dịch vụ</button>
                <button className="primary-button">Thêm hãng xe</button>
            </div>
            <div className="regulation-page__content">
                <div className="regulation-page__body">
                    <div className="regulation-page__header-service col-8">
                        <table className="regulation-table page-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên dịch vụ</th>
                                    <th>Loại dịch vụ</th>
                                    <th>Thời gian thực hiện</th>
                                    <th>Giá</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Thay nhớt</td>
                                    <td>Dịch vụ trong xe</td>
                                    <td>3 ngày</td>
                                    <td>300,000</td>
                                    <td className="overflow-visible">
                                        <div className="table__actions">
                                            <FontAwesomeIcon
                                                icon={faEllipsisVertical}
                                                className="table__action-icon"
                                            />
                                            <div className="table__action-menu">
                                                <div className="table__action-item">Cập nhật</div>
                                                <div className="table__action-item">Xóa</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="regulation-page__header-service col-4">
                        <table className="regulation-table page-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên hãng xe</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Toyota</td>
                                    <td className="overflow-visible">
                                        <div className="table__actions">
                                            <FontAwesomeIcon
                                                icon={faEllipsisVertical}
                                                className="table__action-icon"
                                            />
                                            <div className="table__action-menu">
                                                <div className="table__action-item">Cập nhật</div>
                                                <div className="table__action-item">Xóa</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Regulation
