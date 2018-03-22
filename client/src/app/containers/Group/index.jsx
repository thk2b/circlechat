import React from 'react'
import { Switch, Route, withRouter } from 'react-router'
import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import GroupIcon from 'material-ui-icons/Group'
import ChannelIcon from 'material-ui-icons/RssFeed'
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'

import { 
    ProfilesList,
    Profile,
    CreateChannel,
    ChannelsList,
    Channel,
    ChannelToolbar,
} from '../'
import css from './Group.css'

const styles = theme => ({
    flex: {
        flex: 1
    }
})

const mapState = ({ device }, ownProps) => {
    return { device }
}

class Group extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isProfilesMenuOpen: this.props.device.isDesktop,
            isChannelsMenuOpen: this.props.device.isDesktop,
            viewIndex: 1
        }
    }
    
    toggleMenu(name){
        switch(name){
            case 'channels': return this.setState({
                isChannelsMenuOpen: !this.state.isChannelsMenuOpen
            })
            case 'profiles': return this.setState({
                isProfilesMenuOpen: !this.state.isProfilesMenuOpen
            })
            default: return
        }
    }
    selectView(i){
        this.setState({ viewIndex: i })
    }
    renderMobile(){
        return <SwipeableViews
            className={css.Group}
            index={this.state.viewIndex}
            onChangeIndex={i => this.setState({ viewIndex: i })}
        >
            <Tabs className={css.MenuTabs}>
                <Tab
                    label='channels'
                    icon={<ChannelIcon/>}
                >
                    <ChannelsList resetSwipeableIndex={() => this.setState({ viewIndex: 1 })}/>
                </Tab>
                <Tab
                    label='users'
                    icon={<GroupIcon/>}
                >
                    <ProfilesList resetSwipeableIndex={() => this.setState({ viewIndex: 1 })}/>
                </Tab>
            </Tabs>
            <Switch>
                <Route path='/channel/create' component={CreateChannel}/>
                <Route
                    path='/channel/:id'
                    render={({ match }) => (
                        <Channel match={match} onBack={() => this.setState({ viewIndex: 0 })} />
                    )}
                />
                <Route
                    path='/profile/:id'
                    render={({ match }) => (
                        <Profile match={match} onBack={() => this.setState({ viewIndex: 0 })} />
                    )}
                />
                <Route
                    path='/me'
                    render={({ match }) => (
                        <Profile match={match} onBack={() => this.setState({ viewIndex: 0 })} />
                    )}
                />
                <Route exact path='/' render={()=><div style={{width: 100+'vw'}}/>}/>
            </Switch>
        </SwipeableViews>
    }
    renderTablet(){
        return this.renderMobile()
    }
    renderDesktop(){
        const { classes } = this.props
        const emptyToolbarSection = () => <div className={classes.flex} />

        return <React.Fragment>
            <Toolbar disableGutters>
                <Typography variant='title'>
                    channels
                </Typography>
                <Switch>
                    <Route path='/channel/:id' component={ChannelToolbar}/>
                    <Route render={emptyToolbarSection}/>
                </Switch>
                <Typography variant='title'>
                    profiles
                </Typography>
            </Toolbar>
            <div 
                className={css.Group}
            >
                <ChannelsList/>
                <Switch>
                    <Route path='/channel/create' component={CreateChannel}/>
                    <Route path='/channel/:id' component={Channel}/>
                    <Route path='/profile/:id' component={Profile}/>
                    <Route path='/me' component={Profile}/>
                    <Route exact path='/' render={() => (
                        <Toolbar style={{ flex: 1 }}/>
                    )}/>
                </Switch>
                <ProfilesList/>
            </div>
        </React.Fragment>
    }
    render() {
        const { device } = this.props
        if(device.isMobile) return this.renderMobile()
        if(device.isTablet) return this.renderTablet()
        if(device.isDesktop) return this.renderDesktop()
    }
}

export default withStyles(styles)(withRouter(connect(mapState)(Group)))