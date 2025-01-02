import React from 'react';
import './Dropdown.css';

const Dropdown = ({ options, label, onChange, value, placeholder = "Select an option", className }) => {
    return (
        <div className={`dropdown ${className}`}>
            {label && <label className="dropdown-label">{label}</label>}
            <select 
                className={`dropdown-select ${className}`}
                value={value} 
                onChange={(e) => onChange(e)}
            >
                <option value="" disabled hidden className="dropdown-select-option">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value} className="dropdown-select-option">
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
