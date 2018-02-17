import React from 'react'

import css from './Input.css'

export default ({ value, placeholder=null, onChange, ...rest }) => {
  return (
    <input className={css.Input}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        {...rest}
    />
  )
}