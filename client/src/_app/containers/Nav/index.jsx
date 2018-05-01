import React from 'react'
import { connect } from 'react-redux'

import OwnProfileLink from './OwnProfileLink'
import Settings from './Settings'

export default () => {
    return (
        <nav>
            <OwnProfileLink/>
            <Settings/>
        </nav>
    )
}