import React from 'react'
import classNames from 'classnames'

import css from './SlidingList.css'

export default ({ isOpen, isLeft, isRight, children, ...rest }) => {
    if(isLeft===isRight){
        isLeft=false
    }

    const className = classNames(css.SlidingList, {
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