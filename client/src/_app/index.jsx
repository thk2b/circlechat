import React from 'react'
import styled from 'styled-components'

import {
    Theme,
    Home,
    Nav,
    Group
} from './containers'

import './styles/reset.css'
import './styles/typography.css'
import './styles/surfaces.css'

const Container = styled.div`
    width: 100vw;
    height: 100vh;
`

export default () => {
    return <Theme>
        <Container>
            <Home>
                <Nav />
                <Group />
            </Home>
        </Container>
    </Theme>
}