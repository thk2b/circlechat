import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getProfileOfUser } from '../actions'

const mapState = () => {
    return {}
}

const mapDispatch = dispatch => {
    return bindActionCreators({ getProfileOfUser }, dispatch)
}

