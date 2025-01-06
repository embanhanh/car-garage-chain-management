import { useState, useEffect } from 'react'
import logo from '../../assets/images/logo/logo.png'
import { dbService } from '../../services/DatabaseService'
import Swal from 'sweetalert2'

function DetailInvoiceModal({ onClose, data }) {
    const [isLoading, setIsLoading] = useState(true)
    const [invoiceData, setInvoiceData] = useState(null)
    const [isPaying, setIsPaying] = useState(false)

    const handlePay = async () => {
        if (!invoiceData) return
        try {
            setIsPaying(true)
            await dbService.update('bills', invoiceData.id, { status: 'Đã thanh toán' })
            await Swal.fire({
                title: 'Thành công',
                text: 'Thanh toán thành công',
                icon: 'success',
                confirmButtonText: 'Đóng'
            })
            onClose()
        } catch (error) {
            console.error('Lỗi khi thanh toán:', error)
        } finally {
            setIsPaying(false)
        }
    }

    useEffect(() => {
        let isMounted = true

        const generateInvoice = async () => {
            try {
                if (!data) return

                const billExists = await dbService.findBy('bills', [
                    {
                        field: 'serviceRegisterId',
                        operator: '==',
                        value: data?.id
                    }
                ])

                if (!isMounted) return

                if (billExists.length > 0) {
                    setInvoiceData(billExists[0])
                    setIsLoading(false)
                    return
                }

                const invoice = {
                    employeeId:
                        JSON.parse(localStorage.getItem('currentUser')).employee?.id || 'admin',
                    customerId: null,
                    total: data?.repairRegisters?.reduce(
                        (sum, item) =>
                            sum +
                            Number(item.service.price) +
                            item.repairRegisterComponents.reduce(
                                (sum, component) =>
                                    sum +
                                    Number(component.component.price) * Number(component.quantity),
                                0
                            ),
                        0
                    ),
                    serviceRegisterId: data?.id,
                    status: 'Chưa thanh toán',
                    type: 'repair',
                    garageId: JSON.parse(localStorage.getItem('currentGarage'))?.id
                }

                const newInvoice = await dbService.add('bills', invoice)
                const invoiceData = await dbService.getById('bills', newInvoice.id)

                if (isMounted) {
                    setInvoiceData(invoiceData)
                }
            } catch (error) {
                console.error('Lỗi khi tạo hóa đơn:', error)
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        setIsLoading(true)
        generateInvoice()

        return () => {
            isMounted = false
        }
    }, [data])

    useEffect(() => {
        console.log(invoiceData)
    }, [invoiceData])

    if (isLoading) {
        return (
            <div className="detail-invoice-modal">
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: '200px' }}
                >
                    <p>Đang tạo hóa đơn...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="detail-invoice-modal">
            <div className="detail-invoice-modal__info">
                <div className="detail-invoice-modal__info-img">
                    <img src={logo} alt="logo" />
                </div>
                <div className="detail-invoice-modal__info-content">
                    <h3 className="detail-invoice-modal__label">
                        Địa chỉ:{' '}
                        {JSON.parse(localStorage.getItem('currentUser'))?.employee?.garage?.address}
                    </h3>
                    <h3 className="detail-invoice-modal__label">
                        Hotline:{' '}
                        {JSON.parse(localStorage.getItem('currentUser'))?.employee?.garage?.phone}
                    </h3>
                    <h3 className="detail-invoice-modal__label">Website: https://www.carage.com</h3>
                </div>
            </div>
            <h2 className="detail-invoice-modal__title">HÓA ĐƠN THANH TOÁN</h2>
            <div className="row">
                <div className="col-6">
                    <h3 className="detail-invoice-modal__label">Mã hóa đơn: {invoiceData?.id}</h3>
                </div>

                <div className="col-6">
                    <h3 className="detail-invoice-modal__label">
                        Nhân viên: {invoiceData?.employee?.name}
                    </h3>
                </div>
                <div className="col-6">
                    <h3 className="detail-invoice-modal__label">
                        Ngày tiếp nhận: {new Date(data?.createdAt).toLocaleDateString('vi-VN')}
                    </h3>
                </div>
                <div className="col-6">
                    <h3 className="detail-invoice-modal__label">
                        Ngày thanh toán: {new Date().toLocaleDateString('vi-VN')}
                    </h3>
                </div>
            </div>
            <div className="detail-invoice-modal__table">
                <table className="page-table">
                    <thead>
                        <tr>
                            <th>Thứ tự</th>
                            <th>Tên dịch vụ sử dụng</th>
                            <th>Đơn giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.repairRegisters.map((repairRegister, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{repairRegister.service.name}</td>
                                <td>
                                    đ{' '}
                                    {Number(repairRegister.service.price) +
                                        repairRegister.repairRegisterComponents.reduce(
                                            (sum, component) =>
                                                sum +
                                                Number(component.component.price) *
                                                    Number(component.quantity),
                                            0
                                        )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="detail-invoice-modal__separate"></div>
            <div className="detail-invoice-modal__total">
                <h3 className="detail-invoice-modal__label">Tổng tiền</h3>
                <h3 className="detail-invoice-modal__label">
                    đ {invoiceData?.total?.toLocaleString()}
                </h3>
            </div>
            <div className="page-btns end">
                <button className="page__header-button" onClick={onClose}>
                    Đóng
                </button>
                <button className="primary-button shadow-none">In hóa đơn</button>
                <button
                    className="primary-button shadow-none"
                    disabled={invoiceData?.status !== 'Chưa thanh toán' || isPaying}
                    onClick={handlePay}
                >
                    Thanh toán
                </button>
            </div>
        </div>
    )
}

export default DetailInvoiceModal
