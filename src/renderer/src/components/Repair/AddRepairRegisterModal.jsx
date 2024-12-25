import { useState, useEffect } from 'react'
import { dbService } from '../../services/DatabaseService'
import Dropdown from '../Dropdown'
import ComboBox from '../Combobox'

function AddRepairRegisterModal({ onClose, onAddService }) {
    const [selectedService, setSelectedService] = useState({})
    const [services, setServices] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetchServices = async () => {
            const services = await dbService.getAll('services')
            setServices(services)
        }
        fetchServices()
    }, [])
    return (
        <div className="d-flex flex-column p-3 gap-3 w-100 h-100">
            <div className="row">
                <div className="col-8 repair-modal__input-item">
                    <label htmlFor="registerCode">Mã dịch vụ</label>
                    <ComboBox
                        value={selectedService}
                        onChange={setSelectedService}
                        options={services.map((service) => ({
                            value: service,
                            label: service.id + ' - ' + service.name
                        }))}
                        placeholder="Chọn dịch vụ"
                        height="80px"
                    />
                </div>
                <div className="col-4 repair-modal__input-item">
                    <label htmlFor="registerCode">Tên dịch vụ</label>
                    <div className="input-form">
                        <input
                            type="text"
                            placeholder="Tên dịch vụ"
                            disabled
                            value={selectedService.name}
                        />
                    </div>
                </div>
            </div>
            <div className="page-btns end">
                <button className="repair-modal__button cancel-button" onClick={onClose}>
                    Hủy
                </button>
                <button
                    className="repair-modal__button confirm-button"
                    disabled={isLoading}
                    onClick={async () => {
                        try {
                            setIsLoading(true)
                            await onAddService(selectedService)
                            onClose()
                        } catch (error) {
                            alert(error.message)
                        } finally {
                            setIsLoading(false)
                        }
                    }}
                >
                    Thêm
                </button>
            </div>
        </div>
    )
}

export default AddRepairRegisterModal
