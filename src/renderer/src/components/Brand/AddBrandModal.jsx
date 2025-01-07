import { useState } from 'react'
import Modal from '../../components/Modal'
import { Brand } from '../../models/brand'
import { addBrand } from '../../controllers/brandController'
import Swal from 'sweetalert2'

function AddBrandModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        model: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        try {
            if (!formData.name || !formData.model) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Vui lòng điền đầy đủ thông tin!'
                })
                return
            }

            const brandData = new Brand({
                name: formData.name,
                model: formData.model,
                createdAt: new Date()
            })

            await addBrand(brandData)

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Thêm hãng xe mới thành công!'
            })

            setFormData({
                name: '',
                model: ''
            })

            onSuccess && onSuccess()
            onClose()
        } catch (error) {
            console.error('Lỗi khi thêm hãng xe:', error)
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Đã có lỗi xảy ra khi thêm hãng xe!'
            })
        }
    }

    return (
        <Modal
            title="Thêm hãng xe mới"
            open={isOpen}
            onCancel={onClose}
            onOk={handleSubmit}
            okText="Thêm"
            cancelText="Hủy"
        >
            <div className="form-group">
                <label>Tên hãng xe:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Nhập tên hãng xe"
                />
            </div>

            <div className="form-group">
                <label>Model:</label>
                <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Nhập model xe"
                />
            </div>
        </Modal>
    )
}

export default AddBrandModal 