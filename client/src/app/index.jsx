import React from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

import Nav from './containers/Nav'
import { Group, Auth, TitleBar } from './containers'

import css from './index.css'

export default class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            device: this.getDeviceType()
        }
    }
    componentDidMount = () => {
        window.addEventListener('resize', () => {
            this.setState({ device: this.getDeviceType() })
        })
    }
    
    getDeviceType = () => {
        const isDesktop = window.innerWidth >= 768
        const isMobile = window.innerWidth <= 425
        const isTablet = !isDesktop && !isMobile

        return {
            isDesktop, isMobile, isTablet
        }
    }
    render(){
        const { device } = this.state
        return <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <div className={css.App}>
                <TitleBar />
                <Auth device={device}>
                    <Nav />
                    <Group device={device}/>
                </Auth>
            </div>
        </MuiThemeProvider>
    }   
}