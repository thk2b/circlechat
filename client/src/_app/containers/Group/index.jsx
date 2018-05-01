import React from 'react'
import { connect } from 'react-redux'

import DesktopGroup from './DesktopGroup'
import MobileGroup from './MobileGroup'

const mapState = ({ channels, profiles }) => {
    return {
        channels: Object.values(channels),
        profiles: Object.values(profiles),
    }
}

const mapDispatch = dispatch => {
    return {

    }
}

const Group = ({ device, ...props }) => {
    return device.isMobile
        ? <MobileGroup {...props}/>
        : <DesktopGroup {...props} />
}