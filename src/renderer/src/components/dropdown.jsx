import { useState } from 'react';
import '../components/Modal.css';

function DropdownForm({ name, onChange, className, options = [], hintText }) {
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);
        if (onChange) {
            onChange(value); // Truyền giá trị ra ngoài nếu có callback
        }
    };

    return (
        <div className={`repair-modal__input-item mb-3 ${className}`}>
            <label htmlFor="dropdown">{name}</label>
            <div className="input-form">
                <select
                    className="w-100"
                    id="dropdown"
                    value={selectedValue}
                    onChange={handleChange}
                >
                    <option value="" disabled>
                        {hintText}
                    </option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default DropdownForm;
