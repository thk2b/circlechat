import React from 'react'
import { Switch, Route, withRouter } from 'react-router'
import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import GroupIcon from 'material-ui-icons/Group'
import ChannelIcon from 'material-ui-icons/RssFeed'
import Tabs, { Tab } from 'material-ui/Tabs'
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

const styles = theme => {
    return {
        void: {
            flex: 1,
            backgroundColor: theme.palette.background.default
        },
        toolbar: {
            backgroundColor: theme.palette.primary.main,
            justifyContent: 'space-between',
            color: theme.palette.primary.contrastText
        },
        tabs: {
            backgroundColor: theme.palette.primary.main
        },
        swipableContainer: {
            display: 'flex',
            flexFlow: 'column nowrap',
            height: '100%'
        }
}}

const mapState = ({ device }) => {
    return { device }
}

class Group extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isProfilesMenuOpen: this.props.device.isDesktop,
            isChannelsMenuOpen: this.props.device.isDesktop,
            viewIndex: 0,
            tabIndex: 0
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
    selectTab(i){
        this.setState({ tabIndex: i })
    }
    renderMobile(){
        const { tabIndex } = this.state
        const { classes } = this.props

        const emptyToolbarSection = () => <div className={classes.void} />

        return <SwipeableViews
            style={{
                maxWidth: '100vw',
                flex: 1
            }}
            containerStyle={{
                height: '100%'
            }}
            index={this.state.viewIndex}
            onChangeIndex={i => this.setState({ viewIndex: i })}
        >
            <div className={classes.swipableContainer}>
                <Tabs
                    className={classes.tabs}
                    value={this.state.tabIndex}
                    onChange={(e, i) => this.selectTab(i)}
                    fullWidth
                >
                    <Tab
                        label='channels'
                        icon={<ChannelIcon/>}
                    />
                    <Tab
                        label='users'
                        icon={<GroupIcon/>}
                    />
                </Tabs>
                { tabIndex === 0 && <ChannelsList resetSwipeableIndex={() => this.setState({ viewIndex: 1 })}/>}
                { tabIndex === 1 && <ProfilesList resetSwipeableIndex={() => this.setState({ viewIndex: 1 })}/>}
            </div>
            <div className={classes.swipableContainer}>
                <Toolbar className={classes.toolbar}>
                    <Switch>
                        <Route
                            path='/channel/create'
                            render={() => <Typography
                                variant='title'
                            >
                                create a channel
                            </Typography>}
                        />
                        <Route
                            path='/channel/:id'
                            component={ChannelToolbar}
                        />
                        <Route render={emptyToolbarSection}/>
                    </Switch>
                </Toolbar>
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
            </div>
        </SwipeableViews>
    }
    renderTablet(){
        return this.renderMobile()
    }
    renderDesktop(){
        const { classes } = this.props
        const emptyToolbarSection = () => <div className={classes.void} />

        return <React.Fragment>
            <Toolbar className={classes.toolbar}>
                <Typography
                    variant='title'
                    color='inherit'
                >
                    channels
                </Typography>
                <Switch>
                    <Route
                        path='/channel/create'
                        render={() => <Typography
                            variant='title'
                            color='inherit'
                        >
                            create a channel
                        </Typography>}
                    />
                    <Route
                        path='/channel/:id'
                        component={ChannelToolbar}
                    />
                    <Route render={emptyToolbarSection}/>
                </Switch>
                <Typography
                    variant='title'
                    color='inherit'
                >
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
                        <div className={classes.void}/>
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

export default withRouter(withStyles(styles)(connect(mapState)(Group)))