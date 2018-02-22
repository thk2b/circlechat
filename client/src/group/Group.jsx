import React from 'react'

import SlidingList from '../lib/components/SlidingList'
import ContextMenu from '../lib/components/ContextMenu'
import Button from '../lib/components/Button'

import { ProfilesList } from '../profiles'

export default class Group extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isProfilesMenuOpen: false
        }
    }

    toggleMenu(name){
        if(name === 'users') return this.setState({
            isProfilesMenuOpen: !this.state.isProfilesMenuOpen
        })
    }
    render() {
        const { isProfilesMenuOpen } = this.state
        const { goToProfile, profiles } = this.props
        return <React.Fragment>
            <ContextMenu>
                <Button onClick={e => this.toggleMenu('users')}>users</Button>
            </ContextMenu>
            <SlidingList isRight isOpen={isProfilesMenuOpen}>
                <ProfilesList />
            </SlidingList>
        </React.Fragment>
    }
}