import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

const mapDispatch = dispatch => ({
    goTo: path => e => {
        e.preventDefault()
        dispatch(push(path))
    }
})

const AuthLink = ({ goTo }) => (
    <a
        onClick={goTo('/login')}
        href=""
        rel="noopener" 
    >login</a>
)

const _ = connect(undefined, mapDispatch)(AuthLink)
export { _ as AuthLink }