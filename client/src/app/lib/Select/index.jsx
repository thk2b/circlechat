import React from 'react'

import css from './Select.css'

export default ({ options, onSelect, value }) => {
    return <select
        className={css.Select}
        value={value || options[0]}
        onChange={e => onSelect && onSelect(e.target.value)}
    >
        {options.map(
            (opt, i) => <option
                value={opt}
                key={opt}
            >{opt}</option>
        )}
    </select>
}