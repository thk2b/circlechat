import React from 'react'
import { connect } from 'react-redux'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

import './themes.css'

const mapState = ({ themes }) => {
    return {
        theme: themes.data[themes.active],
    }
}

const Theme = ({ theme, children }) => {
    return <MuiThemeProvider 
        theme={createMuiTheme(theme)}
    >
        {children}
    </MuiThemeProvider>
}

export default connect(mapState)(Theme) 