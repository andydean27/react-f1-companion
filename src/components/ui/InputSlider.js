import React from 'react';
import './InputSlider.css';

const InputSlider = ({ value, label, onChange, min, max, step, unit="", toolTipText="Default" }) => {
    
    return (
        <div className="input-slider-container">
            <div className="input-label">
                {label}
                <span className="tooltiptext container">{toolTipText}</span>
            </div>
            <input
            type="range"
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            className="input-slider"
            />
            <input
            type="number"
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            style={{ appearance: 'textfield' }}
            className='input-number'
            />
        </div>
        );
}

export default InputSlider;