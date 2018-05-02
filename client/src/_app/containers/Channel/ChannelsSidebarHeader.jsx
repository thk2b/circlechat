import React from 'react'

export default ({ isOpen, onClose }) => {
    return isOpen
        ?<header>
            <h2>Channels</h2>            
            
        </header>
        : <header>
            <h2>></h2>
        </header>
}