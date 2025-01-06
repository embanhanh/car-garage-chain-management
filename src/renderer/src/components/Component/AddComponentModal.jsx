import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { dbService } from '../../services/DatabaseService'
import ComboBox from '../Combobox'

function AddComponentModal({ onClose }) {
    const [component, setComponent] = useState({
        name: '',
        price: 0,
        categoryId: '',
        description: '',
        size: '',
        weight: '',
        material: '',
        inventory: 0,
        storagePosition: '',
        garageId: JSON.parse(localStorage.getItem('currentGarage'))?.id
    })
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const storagePositions = ['B1', 'B2', 'B3']

    useEffect(() => {
        const fetchCategory = async () => {
            const categoies = await dbService.getAll('categories')
            setCategories(categoies)
        }
        fetchCategory()
    }, [])

    const onAddComponent = async () => {
        try {
            setIsLoading(true)
            await dbService.add('components', component)
            await Swal.fire({
                title: 'Thành công',
                text: 'Thêm phụ tùng thành công',
                icon: 'success',
                confirmButtonText: 'OK'
            })
            onClose()
        } catch (error) {
            await Swal.fire({
                title: 'Thất bại',
                text: 'Có lỗi xảy ra, vui lòng thử lại',
                icon: 'error',
                confirmButtonText: 'OK'
            })
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="d-flex flex-column gap-3">
                <div className="row">
                    <div className="col-6">
                        <label className="label-for-input" htmlFor="">
                            Loại phụ tùng
                        </label>
                        <ComboBox
                            value={component.categoryId}
                            options={categories.map((cat) => ({
                                value: cat.id,
                                label: cat.name
                            }))}
                            onChange={(value) => {
                                setComponent((pre) => ({
                                    ...pre,
                                    categoryId: value
                                }))
                            }}
                            placeholder="Chọn loại phụ tùng"
                            height="400px"
                        ></ComboBox>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input" htmlFor="">
                            Tên phụ tùng
                        </label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                placeholder="Nhập tên phụ tùng"
                                value={component.name}
                                onChange={(e) => {
                                    setComponent((pre) => ({
                                        ...pre,
                                        name: e.target.value
                                    }))
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input" htmlFor="">
                            Kích cỡ
                        </label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                placeholder="Nhập kích cỡ phụ tùng"
                                value={component.size}
                                onChange={(e) => {
                                    setComponent((pre) => ({
                                        ...pre,
                                        size: e.target.value
                                    }))
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input" htmlFor="">
                            Khối lượng
                        </label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                placeholder="Nhập khối lượng phụ tùng"
                                value={component.weight}
                                onChange={(e) => {
                                    setComponent((pre) => ({
                                        ...pre,
                                        weight: e.target.value
                                    }))
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input" htmlFor="">
                            Chất liệu
                        </label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                placeholder="Nhập chất liệu phụ tùng"
                                value={component.material}
                                onChange={(e) => {
                                    setComponent((pre) => ({
                                        ...pre,
                                        material: e.target.value
                                    }))
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input" htmlFor="">
                            Vị trí lưu trữ
                        </label>
                        <ComboBox
                            value={component.storagePosition}
                            options={storagePositions.map((item) => ({
                                value: item,
                                label: item
                            }))}
                            onChange={(value) => {
                                setComponent((pre) => ({
                                    ...pre,
                                    storagePosition: value
                                }))
                            }}
                            placeholder="Chọn vị trí lưu trữ"
                            height="200px"
                        ></ComboBox>
                    </div>
                    <div className="col-12">
                        <label className="label-for-input" htmlFor="">
                            Mô tả
                        </label>
                        <div className="input-form">
                            <textarea
                                className="w-100"
                                rows={4}
                                type="text"
                                placeholder="Nhập mô tả"
                                value={component.description}
                                onChange={(e) => {
                                    setComponent((pre) => ({
                                        ...pre,
                                        description: e.target.value
                                    }))
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="page-btns end">
                    <button className="page__header-button" onClick={() => onClose()}>
                        Hủy
                    </button>
                    <button
                        disabled={
                            isLoading ||
                            !component.categoryId ||
                            !component.description ||
                            !component.material ||
                            !component.name ||
                            !component.size ||
                            !component.storagePosition ||
                            !component.weight
                        }
                        className="primary-button"
                        onClick={() => onAddComponent()}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </>
    )
}

export default AddComponentModal
