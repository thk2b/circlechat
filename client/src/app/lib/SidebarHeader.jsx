import React from 'react'
import styled from 'styled-components'

const Header = styled.header`
    &:hover > * {
        color: #43a047;
    }
`

export default ({ isOpen, onClose, onOpen, OpenComponent, children }) => {
    return isOpen
        ? <Header onClick={e => onClose()}>
            {children}
        </Header>
    : <Header onClick={e => onOpen()}>
        {OpenComponent}
    </Header>
}