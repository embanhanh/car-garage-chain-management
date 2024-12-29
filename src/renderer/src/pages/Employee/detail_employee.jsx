import TextFieldForm from '../../components/text_field'
import './add_employee.css'
import { useState } from 'react'
import ComboBox from '../../components/Combobox.jsx'
import { dbService } from '../../services/DatabaseService.js'

function DetailEmployee({ nv, onClose }) {
    console.group("Nhan vien", nv)
    function convertToDateString(dateTime) {
        console.log("date Time hehe",dateTime)
        const date = new Date(dateTime) // Chuyển chuỗi sang đối tượng Date
        const day = String(date.getDate()).padStart(2, '0') // Lấy ngày, đảm bảo 2 chữ số
        const month = String(date.getMonth() + 1).padStart(2, '0') // Lấy tháng (tháng bắt đầu từ 0)
        const year = date.getFullYear() // Lấy năm
        return `${day}/${month}/${year}`
    }
    return (
        <div className="z-ae-container w-100">
            <div className="z-ae-row-data row w-100">
                <TextFieldForm
                    className="col-6"
                    hintText="Nhập tên nhân viên"
                    name="Tên nhân viên"
                    enable={false}
                    value={nv.name}
                    onChange={() => {}}
                ></TextFieldForm>
                <TextFieldForm
                    className="col-6"
                    hintText="Nhập email"
                    name="Email"
                    enable={false}
                    value={nv.email}
                    onChange={() => {}}
                ></TextFieldForm>
            </div>
            <div className="z-ae-row-data row w-100">
                <TextFieldForm
                    className="col-6"
                    hintText="Nhập số CCCD/Passport"
                    name="Số CCCD/Passport"
                    enable={false}
                    value={nv.identifyCard}
                    onChange={() => {}}
                ></TextFieldForm>
                <TextFieldForm
                    className="col-6"
                    hintText="Nhập địa chỉ"
                    name="Địa chỉ"
                    enable={false}
                    value={nv.address}
                    onChange={() => {}}
                ></TextFieldForm>
            </div>
            <div className="z-ae-row-data row w-100">
                <TextFieldForm
                    className="col-6"
                    hintText="Nhập số điện thoại"
                    name="Giới tính"
                    enable={false}
                    value={nv.gender}
                    onChange={() => {}}
                ></TextFieldForm>

                <TextFieldForm
                    className="col-6"
                    hintText="Nhập số điện thoại"
                    name="Số điện thoại"
                    enable={false}
                    value={nv.phone}
                    onChange={() => {}}
                ></TextFieldForm>
            </div>
            <div className="z-ae-row-data row w-100">
                <TextFieldForm
                    className="col-6"
                    hintText="Nhập số điện thoại"
                    name="Ngày sinh"
                    enable={false}
                    value={nv.birthday}
                    onChange={() => {}}
                ></TextFieldForm>
                <TextFieldForm
                    className="col-6"
                    hintText="Nhập mức lương"
                    name="Mức lương"
                    enable={false}
                    value={nv.salary}
                    onChange={() => {}}
                ></TextFieldForm>
            </div>
            <div className="z-ae-row-data row w-100">
                <TextFieldForm
                    className="col-6"
                    hintText="Nhập mức lương"
                    name="Vị trí làm việc"
                    enable={false}
                    value={nv.position}
                    onChange={() => {}}
                ></TextFieldForm>

                <TextFieldForm
                    className="col-6"
                    hintText="Nhập mức lương"
                    name="Ca làm việc"
                    enable={false}
                    value={nv.workHours}
                    onChange={() => {}}
                ></TextFieldForm>
            </div>
            <div className="page-btns center">
                <button
                    className="repair-modal__button cancel-button"
                    onClick={() => {
                        onClose()
                    }}
                >
                    OK
                </button>
            </div>
        </div>
    )
}

export default DetailEmployee
