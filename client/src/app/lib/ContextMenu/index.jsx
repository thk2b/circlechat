import React from 'react'

import css from './ContextMenu.css'

export default ({ children, ...rest}) => {
    return <div className={css.ContextMenu} {...rest}>
        { children }
    </div>
}