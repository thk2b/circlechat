import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Grid from '@thk2b/oui/lib/Grid'

import { Auth } from '../'
import Intro from './Intro'

const mapState = ({ auth, device }) => {
    return {
        isLoggedIn: !!auth.token,
        isMobile: device.isMobile
    }
}

const MobileContainer = styled.div`
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
    width: 100%;
    &:last-child {
        flex: 1;
    }
`
const MobileHome = () => {
    return <MobileContainer>
        <div><Intro disableGradient/></div>
        <Auth />
    </MobileContainer>
}

const DesktopHome = () => {
    return <Grid.Container
        columns='61.8fr 38.2fr'
        rows='1fr'
        areas="'intro auth'"
    >
        <Grid.Area intro Component={Intro}/>
        <Grid.Area auth Component={Auth}/>
    </Grid.Container>
}

const Home = ({ isMobile, isLoggedIn, children }) => {
    if(isLoggedIn) return children
    else return isMobile
        ? <MobileHome />
    : <DesktopHome />
}

export default connect(mapState)(Home)