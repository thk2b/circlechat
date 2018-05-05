import React from 'react'

export default ({ isOpen, onClose, onOpen, OpenComponent, children }) => {
    return isOpen
        ? <header onClick={e => onClose()}>
            {children}
        </header>
    : <header onClick={e => onOpen()}>
        {OpenComponent}
    </header>
}