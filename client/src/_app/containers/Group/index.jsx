import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import DesktopGroup from './DesktopGroup'
import MobileGroup from './MobileGroup'

const mapState = ({ device }) => {
    return {
        isMobile: device.isMobile
    }
}

const Group = ({ isMobile, ...props }) => {
    return isMobile
        ? <MobileGroup {...props}/>
        : <DesktopGroup {...props} />
}

export default withRouter(connect(mapState)(Group))