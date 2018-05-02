import React from 'react'

import DesktopGroup from './DesktopGroup'
import MobileGroup from './MobileGroup'

export default ({ device, ...props }) => {
    return device.isMobile
        ? <MobileGroup {...props}/>
        : <DesktopGroup {...props} />
}