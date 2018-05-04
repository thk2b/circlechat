import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import OwnProfileLink from './OwnProfileLink'
import Settings from './Settings'

const Nav = styled.nav`
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
`

const IconContainer = styled.div`
    padding: 10px;
`

export default () => {
    return (
        <Nav>
            <IconContainer>
                <OwnProfileLink/>
            </IconContainer>
            <IconContainer>
                <Settings/>
            </IconContainer>
        </Nav>
    )
}