import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React from 'react'
import ValidationMessages from '../validations/ValidationMessages'

export default function ThemeRadioGroup({ name, value, options, onChange, error, label }) {
    return (
        <>
            <RadioGroup
                row
                aria-label="position"
                name={name}
                value={value}
                onChange={onChange}
            >
                {options.map((option, i) => (
                    <FormControlLabel
                        key={i}
                        value={option?.value}
                        label={option?.label}
                        labelPlacement={option?.labelPlacement || 'start'}
                        control={<Radio color={option?.color} />}
                    />
                ))}
            </RadioGroup>
            <ValidationMessages errors={error} label={label} />
        </>
    )
}
