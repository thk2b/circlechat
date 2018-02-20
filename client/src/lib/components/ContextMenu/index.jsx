import React from 'react'

export default ({ children, ...rest}) => {
    return <div {...rest}>
        { children }
    </div>
}