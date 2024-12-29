import { useState } from 'react'
import '../components/Modal.css'

function TextFieldForm({
    name,
    onChange,
    className,
    hintText,
    type = 'text',
    enable = true,
    value = 'v'
}) {
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
                    type={type}
                    id="componentCode"
                    disabled={!enable}
                    placeholder={hintText}
                    value={value}
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}

export default TextFieldForm
