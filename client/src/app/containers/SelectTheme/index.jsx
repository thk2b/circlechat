import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Select } from '../../lib'

import { setTheme } from '../../../store/modules/themes'

const mapState = ({ themes }) => {
    return {
        themes
    }
}

const mapDispatch = dispatch => bindActionCreators({ setTheme }, dispatch)

const SelectTheme = ({ themes, setTheme }) => {
    return <Select
        options={themes.list}
        onSelect={name => setTheme(name)}
        value={themes.active}
    />
}

export default connect(mapState, mapDispatch)(SelectTheme)