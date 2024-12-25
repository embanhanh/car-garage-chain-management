import { useEffect, useState, useRef } from 'react'
import './Dropdown.css'

export default function SearchDropdown({
    value,
    items = [],
    onSelect,
    renderItem,
    className = '',
    placeholder = '',
    onChange,
    loading = false,
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    return (
        <div className={`dropdown-container ${className}`} ref={dropdownRef}>
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e)
                    setIsOpen(true)
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className="w-100"
                disabled={disabled}
            />
            {isOpen && (items.length > 0 || loading) && (
                <div className="dropdown-list">
                    {loading ? (
                        <div className="dropdown-item text-center">Đang tải...</div>
                    ) : (
                        items.map((item, index) => (
                            <div
                                key={index}
                                className="dropdown-item"
                                onClick={() => {
                                    onSelect(item)
                                    setIsOpen(false)
                                }}
                            >
                                {renderItem ? renderItem(item) : item}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
