import { useState, useRef, useEffect } from 'react'
function ComboBox({ value, onChange, options, placeholder = 'Chọn', height = 'auto' }) {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef(null)
    const selectedOption = options.find((opt) => opt.value === value)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    return (
        <div className="custom-select" ref={selectRef}>
            <div
                className={`custom-select__trigger ${!selectedOption ? 'placeholder' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? selectedOption.label : placeholder}
            </div>
            {isOpen && (
                <div className="custom-select__options" style={{ height: height }}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`custom-select__option ${option.disabled ? 'disabled' : ''} ${value === option.value ? 'selected' : ''}`}
                            onClick={() => {
                                if (!option.disabled) {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default ComboBox
