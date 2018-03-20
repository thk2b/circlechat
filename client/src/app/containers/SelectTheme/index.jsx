import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Select } from '../../lib'

import { setTheme } from '../../../store/modules/themes'

const mapState = ({ themes }) => {
    return {
        activeTheme: themes.active,
        themeNames: Object.keys(themes.data)
    }
}

const mapDispatch = dispatch => bindActionCreators({ setTheme }, dispatch)

const SelectTheme = ({ activeTheme, themeNames, setTheme }) => {
    return <Select
        options={themeNames}
        onSelect={name => setTheme(name)}
        value={activeTheme}
    />
}

export default connect(mapState, mapDispatch)(SelectTheme)