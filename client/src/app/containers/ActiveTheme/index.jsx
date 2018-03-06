import React from 'react'
import { connect } from 'react-redux'

import themes from './themes.css'

const mapState = ({ themes }, ownProps) => ({
    name: themes.list[themes.active].name,
    ...ownProps
})

const Theme = ({ name, children }) => (
    <div className={themes[name]}>
        {children}
    </div>
)

export default connect(mapState)(Theme) 