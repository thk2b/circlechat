import React from 'react'

import css from './ButtonGroup.css'

export default ({ maxWidth, children }) => {
    return <div
        className={css.ButtonGroup}
        style={{maxWidth: maxWidth + 'px'}}
        >{children}
    </div>
}