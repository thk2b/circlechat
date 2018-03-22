import React from 'react'
import { connect } from 'react-redux'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

import './themes.css'

const themes = {
    light: {
        palette: {
            type: 'light',
        }
    },
    dark: {
        palette: {
            type: 'dark',
        }
    }
}

const mapState = ({ theme }) => {
    console.log(createMuiTheme(themes[theme.active]))
    return {
        theme: themes[theme.active],
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