import React from 'react'
import { Switch, Route } from 'react-router'
import MdChevronLeft from 'react-icons/lib/md/chevron-left'
import MdChevronRight from 'react-icons/lib/md/chevron-right'

import { Menu, ContextMenu, Button} from '../../lib'

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
        this.isDesktop = window.innerWidth >= 680
        this.isPhablet = window.innerWidth >= 480
        this.isMobile = window.innerWidth <= 480
        this.state = {
            isProfilesMenuOpen: this.isDesktop,
            isChannelsMenuOpen: this.isPhablet
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

    render() {
        const { isProfilesMenuOpen, isChannelsMenuOpen } = this.state
        return <React.Fragment>
            <ContextMenu>
                <Button onClick={e => this.toggleMenu('channels')}>
                    {isChannelsMenuOpen? <MdChevronLeft/>: <MdChevronRight/>}
                    channels
                </Button>
                <Button onClick={e => this.toggleMenu('profiles')}>
                    users
                    {isProfilesMenuOpen? <MdChevronRight/>: <MdChevronLeft/>}
                </Button>
            </ContextMenu>
            <main className={css.Container}>
                <Menu isLeft 
                    isOpen={isChannelsMenuOpen} 
                    onClick={e => this.isMobile && this.toggleMenu('channels')}
                    ><ChannelsList />
                </Menu>
                <Switch>
                    <Route path='/channel/create' component={CreateChannel}/>
                    <Route path='/channel/:id' component={Channel}/>
                    <Route path='/profile/:id' component={Profile}/>
                    <Route path='/me' component={Profile}/>
                </Switch>
                <Menu isRight 
                    isOpen={isProfilesMenuOpen}
                    onClick={e => this.isMobile && this.toggleMenu('profiles')}
                    ><ProfilesList />
                </Menu>
            </main>
        </React.Fragment>
    }
}