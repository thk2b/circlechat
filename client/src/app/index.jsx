import React from 'react'

import { withStyles } from 'material-ui/styles'

import Nav from './containers/Nav'
import { Theme, Group, Auth, TitleBar } from './containers'
import css from './index.css'

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.default
    }
})

class App extends React.Component {
    render(){
        const { classes } = this.props
        return <div className={css.App + ' ' + classes.root}>
            <TitleBar />
            <Auth>
                <Nav />
                <Group />
            </Auth>
        </div>
    }   
}

export default withStyles(styles)(App)