import React from 'react'

const ProfileSidebarHeader = ({ isOpen, onClose }) => {
    return isOpen
        ?<header>
            <h2>Profiles</h2>            
            <Icon/>
        </header>
        : <Icon/>
}

export default connect(mapState, mapDispatch)(ProfileSidebarHeader)