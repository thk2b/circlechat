import React from 'react'

import DesktopGroup from './DesktopGroup'
import MobileGroup from './MobileGroup'

const mapState = ({ device }) => {
    return {
        isMobile: device.isMobile
    }
}

export default ({ isMobile, ...props }) => {
    return isMobile
        ? <MobileGroup {...props}/>
        : <DesktopGroup {...props} />
}