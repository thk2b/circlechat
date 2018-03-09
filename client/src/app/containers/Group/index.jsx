import React from 'react'
import { Route } from 'react-router'
import MdChevronLeft from 'react-icons/lib/md/chevron-left'
import MdChevronRight from 'react-icons/lib/md/chevron-right'

import { Menu, ContextMenu, Button} from '../../lib'

import { ProfilesList, ChannelsList, Channel } from '../'
import css from './Group.css'

export default class Group extends React.Component {
    constructor(props){
        super(props)
        const isDesktop = window.innerWidth >= 680
        const isPhablet = window.innerWidth >= 380
        this.state = {
            isProfilesMenuOpen: isDesktop,
            isChannelsMenuOpen: isPhablet
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
        }
    }
    render() {
        const { isProfilesMenuOpen, isChannelsMenuOpen } = this.state
        const { goToProfile, profiles } = this.props
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
                <Menu isLeft isOpen={isChannelsMenuOpen}>
                    <ChannelsList />
                </Menu>
                <Route path='/c/:id' component={Channel}/>
                <Menu isRight isOpen={isProfilesMenuOpen}>
                    <ProfilesList />
                </Menu>
            </main>
        </React.Fragment>
    }
}