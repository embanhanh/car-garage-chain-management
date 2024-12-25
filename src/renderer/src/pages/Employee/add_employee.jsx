import TextFieldForm from "../../components/text_field";
import './add_employee.css'
import DropdownForm from "../../components/dropdown.jsx";
import { useState } from 'react'
import SearchDropdown from "../../components/dropdown.jsx";
import ComboBox from '../../components/Combobox.jsx'

function AddEmployee() {
    const [conName, setConName] = useState("");
    const [conEmail, setConEmail] = useState("");
    const [conSex, setConSex] = useState(0);
    return <div>
        <div className="z-ae-container w-100">
            <div className="z-ae-row-data row w-100">
                <TextFieldForm className = "col-6" hintText="Nhập tên nhân viên" name="Tên nhân viên" onChange= {(value) => {setConName(value)}}></TextFieldForm>
                <TextFieldForm className = "col-6" hintText="Nhập email" name="Email" onChange= {(value) => {setConEmail(value)}}></TextFieldForm>
            </div>
            <div className="z-ae-row-data row w-100">
                <TextFieldForm className = "col-6" hintText="Nhập số CCCD/Passport" name="Số CCCD/Passport" onChange= {(value) => {setConName(value)}}></TextFieldForm>
                <TextFieldForm className = "col-6" hintText="Nhập địa chỉ" name="Địa chỉ" onChange= {(value) => {setConEmail(value)}}></TextFieldForm>
            </div>
            <div className="z-ae-row-data row w-100">
                <div className="col-6">
                <ComboBox options={[{value: 0, label: "Nam"}, {value: 1, label: "Nữ"},{value: -1, label: "Bê đê"}]} className = "col-6" placeholder="Chọn giới tính" value={conSex} onChange= {(value) => {setConSex(value)}}></ComboBox>
                </div>
                
                <TextFieldForm className = "col-6" hintText="Nhập số điện thoại" name="Số điện thoại" onChange= {(value) => {setConEmail(value)}}></TextFieldForm>
            </div>
            <div className="z-ae-row-data row w-100">
                <TextFieldForm className = "col-6" hintText="Nhập tên nhân viên" name="Tên nhân viên" onChange= {(value) => {setConName(value)}}></TextFieldForm>
                <TextFieldForm className = "col-6" hintText="Nhập mức lương" name="Mức lương" onChange= {(value) => {setConEmail(value)}}></TextFieldForm>
            </div>
        </div>
    </div>;
}

export default AddEmployee;