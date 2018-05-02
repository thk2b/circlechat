import React from 'react'

export default ({ isOpen, onClose, onOpen }) => {
    return isOpen
        ? <header onClick={e => onClose()}>
            <h2>Profiles</h2>
        </header>
    : <header onClick={e => onOpen()}>
        <h2>></h2>
    </header>
}