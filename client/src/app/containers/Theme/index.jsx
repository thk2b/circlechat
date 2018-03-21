import React from 'react'
import { connect } from 'react-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import './themes.css'

const mapState = ({ themes }) => {
    return {
        theme: themes.data[themes.active],
    }
}

const Theme = ({ theme, children }) => (
    <MuiThemeProvider 
        muiTheme={getMuiTheme(theme)}
    >
        {children}
    </MuiThemeProvider>
)

export default connect(mapState)(Theme) 