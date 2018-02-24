import React from 'react'
import classNames from 'classnames'

import css from './Button.css'

export default ({ 
    onClick,
    underlined,
    children,
    ...rest
}) => {
  return (
    <button
        onClick={onClick}
        className={classNames(css.Button, {
            [css.ButtonUnderlined]: underlined
        })}
        {...rest}
    >
        {children}
    </button>
  )
}
