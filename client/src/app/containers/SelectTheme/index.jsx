import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Select } from '../../lib'

import { setTheme } from '../../../store/modules/theme'

const mapState = ({ theme }) => {
    return {
        activeTheme: theme.active,
        themeNames: ['light', 'dark']
    }
}

const mapDispatch = dispatch => bindActionCreators({ setTheme }, dispatch)

const SelectTheme = ({ activeTheme, themeNames, setTheme }) => {
    return <React.Fragment>
        theme: 
        <Select
            options={themeNames}
            onSelect={name => setTheme(name)}
            value={activeTheme}
        />
    </React.Fragment>
}

export default connect(mapState, mapDispatch)(SelectTheme)