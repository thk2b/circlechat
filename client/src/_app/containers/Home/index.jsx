import React from 'react'
import { connect } from 'react-redux'
import { Grid } from 'oui'

import { Auth } from '../'
import Intro from './Intro'

const mapState = ({ auth, device }) => {
    return {
        isLoggedIn: !!auth.token,
        isMobile: device.isMobile
    }
}

const MobileHome = () => {
    return <div>
        <Intro />
        <Auth />
    </div>
}

const DesktopHome = () => {
    return <Grid.Container
        columns='61.8fr 38.2fr'
        rows='1fr'
        areas="intro auth"
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