import React from 'react'
import { Switch, Route } from 'react-router'

import GroupIcon from 'material-ui/svg-icons/social/group'
import ChatIcon from 'material-ui/svg-icons/communication/chat'
import ChannelIcon from 'material-ui/svg-icons/communication/rss-feed'
import IconButton from 'material-ui/IconButton'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
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
        return <React.Fragment>
            <BottomNavigation selectedIndex={this.state.viewIndex}>
                <BottomNavigationItem
                    label="channels"
                    icon={<ChannelIcon/>}
                    onClick={e => this.selectView(0)}
                />
                <BottomNavigationItem
                    label="chat"
                    icon={<ChatIcon />}
                    onClick={e => this.selectView(1)}
                />
                <BottomNavigationItem
                    label="users"
                    icon={<GroupIcon/>}
                    onClick={e => this.selectView(2)}
                />
            </BottomNavigation>
            <SwipeableViews
                resistance
                className={css.Group}
                index={this.state.viewIndex}
                onChangeIndex={i => this.setState({ viewIndex: i })}
            >
                <ChannelsList resetSwipeableIndex={() => this.setState({ viewIndex: 1 })}/>
                <Switch>
                    <Route path='/channel/create' component={CreateChannel}/>
                    <Route path='/channel/:id' component={Channel}/>
                    <Route path='/profile/:id' component={Profile}/>
                    <Route path='/me' component={Profile}/>
                </Switch>
                <ProfilesList resetSwipeableIndex={() => this.setState({ viewIndex: 1 })}/>
            </SwipeableViews>
        </React.Fragment>
    }
    renderTablet(){
        return this.renderMobile()
    }
    renderDesktop(){
        return <React.Fragment>
            <div className={css.Group}>
                <ChannelsList showHeader/>
                <Switch>
                    <Route path='/channel/create' component={CreateChannel}/>
                    <Route path='/channel/:id' component={Channel}/>
                    <Route path='/profile/:id' component={Profile}/>
                    <Route path='/me' component={Profile}/>
                </Switch>
                <ProfilesList showHeader/>
            </div>
        </React.Fragment>
    }
    render() {
        const { isProfilesMenuOpen, isChannelsMenuOpen } = this.state
        const { device } = this.props
        if(device.isMobile) return this.renderMobile()
        if(device.isTablet) return this.renderTablet()
        if(device.isDesktop) return this.renderDesktop()
    }
}