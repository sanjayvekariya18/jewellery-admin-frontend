import React from 'react'
import Android12Switch from '../Android12Switch'

export default function ThemeSwitch({ name, checked = null, value, color = 'default', onChange, ...rest }) {
    return (
        <>
            <Android12Switch
                name={name}
                checked={(checked || value) || false}
                color={color}
                onChange={(event) => {
                    onChange({
                        target: {
                            name,
                            checked: event.target.checked ? true : false,
                            value: event.target.checked ? true : false,
                        }
                    })
                }}
                {...rest}
            />
        </>
    )
}
