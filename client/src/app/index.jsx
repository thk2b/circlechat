import React from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

import Nav from './containers/Nav'
import { Group, Auth, TitleBar } from './containers'

import css from './index.css'

export default class App extends React.Component {
    render(){
        return <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <div className={css.App}>
                <TitleBar />
                <Auth>
                    <Nav />
                    <Group/>
                </Auth>
            </div>
        </MuiThemeProvider>
    }   
}