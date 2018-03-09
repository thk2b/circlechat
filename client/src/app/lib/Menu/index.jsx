import React from 'react'
import classNames from 'classnames'

import css from './Menu.css'

export default ({ children, isOpen, isLeft, isRight,...rest }) => {
    if(isLeft===isRight){
        isLeft=false
    }
    const className = classNames(css.Menu, {
        [css.isRight]: isRight,
        [css.isLeft]: isLeft,
        [css.isHidden]: !isOpen
    })
    return <ul className={className}
        {...rest}
    >
        { children }
    </ul>
}