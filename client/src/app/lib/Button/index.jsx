import React from 'react'
import classNames from 'classnames'

import css from './Button.css'

export default ({ 
    onClick,
    primary,
    underlined,
    children,
    ...rest
}) => {
  return (
    <button
        onClick={onClick}
        className={classNames(css.Button, {
            [css.isPrimary]: primary,
            [css.isUnderlined]: underlined
        })}
        {...rest}
    >
        {children}
    </button>
  )
}
