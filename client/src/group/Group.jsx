import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapState = () => {
    return {}
}
const mapDispatch = dispatch => {
    return {}
}

export default ({ push, token }) => {
    if(! token )
    return (
        <div>
        group
        </div>
    )
}
