import React from 'react'

export default ({ isOpen, left, right=true, children, ...rest }) => {
    if(! isOpen ) return null

    return <ul {...rest}>
        { children }
    </ul>
}