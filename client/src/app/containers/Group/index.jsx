import React from 'react'
import { Switch, Route } from 'react-router'

import GroupIcon from 'material-ui/svg-icons/social/group'
import ChatIcon from 'material-ui/svg-icons/communication/chat'
import ChannelIcon from 'material-ui/svg-icons/communication/rss-feed'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'

import { 
    ProfilesList,
    Profile,
    CreateChannel,
    ChannelsList,
    Channel 
} from '../'
import css from './Group.css'

export default class Group extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isProfilesMenuOpen: this.props.device.isDesktop,
            isChannelsMenuOpen: this.props.device.isPhablet,
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
        return <React.Fragment>
            <div className={css.Group}>
                <Toolbar>
                    <ToolbarGroup>

                    </ToolbarGroup>
                    <ToolbarGroup>

                    </ToolbarGroup>
                    <ToolbarGroup>

                    </ToolbarGroup>
                </Toolbar>
                <ChannelsList />
                <Switch>
                    <Route path='/channel/create' component={CreateChannel}/>
                    <Route path='/channel/:id' component={Channel}/>
                    <Route path='/profile/:id' component={Profile}/>
                    <Route path='/me' component={Profile}/>
                </Switch>
                <ProfilesList />
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