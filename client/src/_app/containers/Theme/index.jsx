import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ theme }) => {
    return {
        theme: theme.active
    }
}

const Theme = ({ theme }) => <div className={theme}></div>

export default connect(mapState)(Theme)