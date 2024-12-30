import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import ComboBox from '../Combobox'
import { dbService } from '../../services/DatabaseService'

function UpDetailComponentModal({ data, onClose, type }) {
    const [component, setComponent] = useState(data)
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const storagePositions = ['B1', 'B2', 'B3']

    useEffect(() => {
        if (type !== 'detail') {
            const fetchCategory = async () => {
                const categoies = await dbService.getAll('categories')
                setCategories(categoies)
            }
            fetchCategory()
        }
    }, [type])

    const onUpdateComponent = async () => {
        try {
            setIsLoading(true)
            const data = {
                name: component.name,
                price: Number(component.price),
                categoryId: component.categoryId,
                description: component.description,
                size: component.size,
                weight: component.weight,
                material: component.material,
                inventory: Number(component.inventory),
                storagePosition: component.storagePosition
            }
            await dbService.update('components', component.id, data)
            await Swal.fire({
                title: 'Thành công',
                text: 'Cập nhật phụ tùng thành công',
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
                        {type == 'detail' ? (
                            <div className="input-form">
                                <input
                                    className="w-100"
                                    disabled
                                    type="text"
                                    placeholder="Loại phụ tùng"
                                    value={component?.category?.name}
                                />
                            </div>
                        ) : (
                            <ComboBox
                                value={component?.categoryId}
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
                        )}
                    </div>
                    <div className="col-6">
                        <label className="label-for-input" htmlFor="">
                            Tên phụ tùng
                        </label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                disabled={type == 'detail'}
                                placeholder="Nhập tên phụ tùng"
                                value={component?.name}
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
                                value={component?.size}
                                disabled={type == 'detail'}
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
                                disabled={type == 'detail'}
                                value={component?.weight}
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
                                disabled={type == 'detail'}
                                value={component?.material}
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
                        {type == 'detail' ? (
                            <div className="input-form">
                                <input
                                    className="w-100"
                                    disabled
                                    type="text"
                                    placeholder="Vị trí lưu trữ"
                                    value={component?.storagePosition}
                                />
                            </div>
                        ) : (
                            <ComboBox
                                value={component?.storagePosition}
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
                        )}
                    </div>
                    <div className="col-6">
                        <label className="label-for-input" htmlFor="">
                            Số lượng
                        </label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="number"
                                placeholder="Nhập số lượng phụ tùng"
                                disabled={type == 'detail'}
                                value={component?.inventory}
                                onChange={(e) => {
                                    setComponent((pre) => ({
                                        ...pre,
                                        inventory: e.target.value
                                    }))
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input" htmlFor="">
                            Đơn giá
                        </label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="number"
                                placeholder="Nhập đơn giá phụ tùng"
                                disabled={type == 'detail'}
                                value={component?.price}
                                onChange={(e) => {
                                    setComponent((pre) => ({
                                        ...pre,
                                        price: e.target.value
                                    }))
                                }}
                            />
                        </div>
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
                                value={component?.description}
                                disabled={type == 'detail'}
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
                <div className="page-btns center">
                    <button className="page__header-button" onClick={() => onClose()}>
                        Hủy
                    </button>
                    {type !== 'detail' && (
                        <button
                            disabled={
                                isLoading ||
                                !component.categoryId ||
                                !component.description ||
                                !component.material ||
                                !component.name ||
                                !component.size ||
                                !component.storagePosition ||
                                !component.weight ||
                                !component.price ||
                                !component.inventory
                            }
                            onClick={() => onUpdateComponent()}
                            className="primary-button"
                        >
                            Lưu
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

export default UpDetailComponentModal
