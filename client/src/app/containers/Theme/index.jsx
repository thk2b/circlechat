import React from 'react'
import { connect } from 'react-redux'

import css from './themes.css'

const mapState = ({ themes }, ownProps) => ({
    name: themes.active,
    ...ownProps
})

const Theme = ({ name, children }) => (
    <div className={css[name]}>
        {children}
    </div>
)

export default connect(mapState)(Theme) 