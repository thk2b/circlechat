import React from 'react'

import css from './InputWithButtons.css'

export default ({ children, ...rest }) => {
    return <div {...rest} className={css.InputWithButton}>
        { children }
    </div>
}
