import { useState } from 'react'
import '../components/Modal.css'

function TextFieldForm({ name, onChange, className, hintText }) {
    const [inputValue, setInputValue] = useState('')
    const handleChange = (event) => {
        const value = event.target.value
        setInputValue(value)
        if (onChange) {
            onChange(value)
        }
    }
    return (
            <div className={`repair-modal__input-item mb-3 ${className}`}>
                <label htmlFor="componentCode">{name}</label>
                <div className="input-form">
                    <input
                        className="w-100"
                        type="text"
                        id="componentCode"
                        placeholder={hintText}
                        onChange={handleChange}
                    />
                </div>
            </div>
    )
}

export default TextFieldForm
