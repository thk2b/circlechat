import React from 'react'
import classNames from 'classnames'

import css from './SlidingList.css'

export default ({ isOpen, isLeft, isRight, children, ...rest }) => {
    if(isLeft===isRight){
        isLeft=false
    }
    if(! isOpen ) return null

    // return <ul className={SlidingList}
    return <ul className={classNames(css.SlidingList, css.isRight)}
        {...rest}
    >
        { children }
    </ul>
}