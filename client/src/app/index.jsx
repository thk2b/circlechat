import React from 'react'

import Nav from './containers/Nav'
import { Group, Auth, TitleBar } from './containers'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import css from './index.css'

export default () => (
    <MuiThemeProvider>
        <div className={css.App}>
            <TitleBar />
            <Auth>
                <Nav />
                <Group />
            </Auth>
        </div>
    </MuiThemeProvider>
)