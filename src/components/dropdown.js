import React, { useState } from 'react';
import "./modal.css";

import Select from 'react-select';

function Dropdown({ options, onChange }) {
    const [value, setValue] = useState(null);
    const handleChange = (selectedOption) => {
        setValue(selectedOption);
        onChange(selectedOption);
    };

    return (
        <div className='choose-box'>
            <div>
                <Select
                    name="role"
                    options={options}
                    isMulti={false}
                    value={value}
                    onChange={handleChange}
                    placeholder="Rol"
                />
            </div>
        </div >
    )
}
export default Dropdown;