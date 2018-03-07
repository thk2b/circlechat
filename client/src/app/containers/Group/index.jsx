import React from 'react'
import MdChevronLeft from 'react-icons/lib/md/chevron-left'
import MdChevronRight from 'react-icons/lib/md/chevron-right'

import { SlidingList, ContextMenu, Button} from '../../lib'

import ProfilesList from '../ProfilesList'

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
                <Button onClick={e => this.toggleMenu('users')}>
                    users
                    {isProfilesMenuOpen? <MdChevronRight/>: <MdChevronLeft />}
                </Button>
            </ContextMenu>
            <SlidingList isRight isOpen={isProfilesMenuOpen}>
                <ProfilesList />
            </SlidingList>
        </React.Fragment>
    }
}