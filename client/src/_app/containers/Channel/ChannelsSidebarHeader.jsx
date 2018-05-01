import React from 'react'

const ChannelsSidebarHeader = ({ isOpen, onClose }) => {
    return isOpen
        ?<header>
            <h2>Channels</h2>            
            <Icon/>
        </header>
        : <Icon/>
}

export default connect(mapState, mapDispatch)(ChannelsSidebarHeader)