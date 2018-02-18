import React from 'react'
import classNames from 'classnames'

import css from './Info.css'

export default ({ success, danger, warning, children, ...rest }) => {
    return (
        <p 
            className={classNames(css.Info, {
                [css.InfoSuccess]: success,
                [css.InfoDanger]: danger,
                [css.InfoWarning]: warning
            })}
            {...rest}
        >
            {children}
        </p>
    )
}