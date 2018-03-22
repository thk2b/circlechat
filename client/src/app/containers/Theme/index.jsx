import React from 'react'
import { connect } from 'react-redux'

import { MuiThemeProvider, createTheme } from 'material-ui/styles'

import './themes.css'

const mapState = ({ themes }) => {
    return {
        theme: themes.data[themes.active],
    }
}

const Theme = ({ theme, children }) => (
    <MuiThemeProvider 
        muiTheme={createTheme(theme)}
    >
        {children}
    </MuiThemeProvider>
)

export default connect(mapState)(Theme) 