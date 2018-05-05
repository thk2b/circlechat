import React from 'react'
import styled from 'styled-components'

import OwnProfileLink from './OwnProfileLink'
import Settings from './Settings'

const Nav = styled.nav`
    display: flex;
    justify-content: space-between;

    @media (min-width: 425px){
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
    }
`

export default () => {
    return (
        <Nav>
            <OwnProfileLink/>
            <Settings/>
        </Nav>
    )
}