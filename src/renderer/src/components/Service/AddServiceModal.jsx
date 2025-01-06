import { useState, useEffect } from 'react'
import { addService } from '../../controllers/serviceController'
import { getServiceType } from '../../controllers/serviceTypeController'
import TextFieldForm from '../../components/text_field'
import ComboBox from '../../components/Combobox'
import Modal from '../../components/Modal'
import Swal from 'sweetalert2'

export default function AddServiceModal({
    isOpen,
    onClose,
    service = {},
    isEdit = false,
    onSuccess
}) {
    const [serviceData, setServiceData] = useState(
        isEdit
            ? service
            : {
                  serviceName: isEdit ? service.name : '',
                  servicePrice: isEdit ? service.price : '',
                  serviceDuration: isEdit ? service.duration : '',
                  serviceType: isEdit ? service.serviceTypeId : '',
                  serviceDescription: isEdit ? service.description : ''
              }
    )
    const [serviceTypes, setServiceTypes] = useState([])

    const fetchServiceTypes = async () => {
        const serviceTypes = await getServiceType()
        setServiceTypes(serviceTypes)
    }

    useEffect(() => {
        fetchServiceTypes()
    }, [])

    const [isShowAlertlog, setIsShowAlertlog] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
            width="600px"
        >
            <div className="z-ae-container w-100">
                <Modal
                    isOpen={isShowAlertlog}
                    onClose={() => setIsShowAlertlog(false)}
                    showHeader={false}
                    width="350px"
                >
                    <div className="center">
                        <p className="text-center fw-bold fs-20 text-danger error-message">Lỗi</p>
                        <p className="text-center fw-bold fs-20 text-danger">{errorMessage}</p>
                    </div>
                </Modal>

                <div className="z-ae-row-data row w-100">
                    <TextFieldForm
                        className="col-6"
                        hintText="Nhập tên dịch vụ"
                        name="Tên dịch vụ"
                        value={serviceData.serviceName}
                        onChange={(value) => setServiceData({ ...serviceData, serviceName: value })}
                    />
                    <TextFieldForm
                        className="col-6"
                        hintText="Nhập giá dịch vụ"
                        name="Giá dịch vụ"
                        value={serviceData.servicePrice}
                        onChange={(value) =>
                            setServiceData({ ...serviceData, servicePrice: value })
                        }
                    />
                </div>

                <div className="z-ae-row-data row w-100">
                    <TextFieldForm
                        className="col-6"
                        hintText="Nhập thời gian thực hiện (phút)"
                        name="Thời gian thực hiện"
                        value={serviceData.serviceDuration}
                        onChange={(value) =>
                            setServiceData({ ...serviceData, serviceDuration: value })
                        }
                    />
                    <div className="repair-modal__input-item mb-3 col-6">
                        <label htmlFor="serviceType">Loại dịch vụ</label>
                        <ComboBox
                            height="90px"
                            options={serviceTypes.map((type) => ({
                                value: type.id,
                                label: type.name
                            }))}
                            placeholder="Chọn loại dịch vụ"
                            value={serviceData.serviceType}
                            onChange={(value) =>
                                setServiceData({ ...serviceData, serviceType: value })
                            }
                        />
                    </div>
                </div>

                <div className="z-ae-row-data row w-100">
                    <div className="col-12">
                        <label className="label-for-input">Mô tả</label>
                        <div className="input-form">
                            <textarea
                                className="w-100"
                                rows="3"
                                placeholder="Nhập mô tả dịch vụ"
                                value={serviceData.serviceDescription}
                                onChange={(e) =>
                                    setServiceData({
                                        ...serviceData,
                                        serviceDescription: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="page-btns end mt-3">
                    <button
                        className="repair-modal__button cancel-button"
                        onClick={() => onClose()}
                    >
                        Hủy
                    </button>
                    <button
                        className="repair-modal__button confirm-button"
                        disabled={isLoading}
                        onClick={async () => {
                            try {
                                setIsLoading(true)
                                if (
                                    !serviceData.serviceName ||
                                    !serviceData.servicePrice ||
                                    !serviceData.serviceDuration ||
                                    !serviceData.serviceType
                                ) {
                                    setErrorMessage('Vui lòng điền đầy đủ thông tin dịch vụ')
                                    setIsShowAlertlog(true)
                                    return
                                }

                                const serviceData2 = {
                                    name: serviceData.serviceName,
                                    description: serviceData.serviceDescription,
                                    price: Number(serviceData.servicePrice.replace(/[^\d]/g, '')),
                                    duration: Number(serviceData.serviceDuration),
                                    serviceTypeId: serviceData.serviceType,
                                    createdAt: new Date()
                                }

                                if (isEdit) {
                                    await addService({ ...serviceData2, id: service.id })
                                    Swal.fire({
                                        title: 'Thành công',
                                        text: 'Cập nhật dịch vụ thành công',
                                        icon: 'success'
                                    }).then(() => {
                                        onSuccess()
                                        onClose()
                                    })
                                } else {
                                    await addService(serviceData2)
                                    Swal.fire({
                                        title: 'Thành công',
                                        text: 'Thêm dịch vụ thành công',
                                        icon: 'success'
                                    }).then(() => {
                                        onSuccess()
                                        onClose()
                                    })
                                }
                            } catch (error) {
                                console.log(error)
                                setErrorMessage('Có lỗi xảy ra khi thêm dịch vụ')
                                setIsShowAlertlog(true)
                            } finally {
                                setIsLoading(false)
                            }
                        }}
                    >
                        {isLoading
                            ? isEdit
                                ? 'Đang cập nhật...'
                                : 'Đang thêm...'
                            : isEdit
                              ? 'Cập nhật'
                              : 'Thêm'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
