import React from 'react'

import { withStyles } from 'material-ui/styles'

import Nav from './containers/Nav'
import { Theme, Group, Auth, TitleBar } from './containers'
import css from './index.css'

// const styles = theme => ({
//     root: {
//         backgroundColor: theme.palette.background.paper
//     }
// })

class App extends React.Component {    
    render(){
        const { classes } = this.props
        return <Theme>
            {/* <div className={css.App + ' ' + classes.root}> */}
            <div className={css.App}>
                <TitleBar />
                <Auth>
                    <Nav />
                    <Group />
                </Auth>
            </div>
        </Theme>
    }   
}

export default App
// export default withStyles(styles)(App)