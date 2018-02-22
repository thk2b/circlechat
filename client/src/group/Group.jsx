import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import SlidingList from '../lib/components/SlidingList'
import ContextMenu from '../lib/components/ContextMenu'
import Button from '../lib/components/Button'

import { ProfileListItem } from '../profiles'

import { getAll as getAllProfiles } from '../profiles'


const mapState = ({ auth, profiles }) => {
    return {
        token: auth.token,
        profiles: Object.keys(profiles.data).reduce(
            (arr, id) => [...arr, profiles.data[id]]
        ,[])
    }
}
const mapDispatch = dispatch => {
    return {
        goToProfile: id => dispatch(push('/profile/'+id)),
        ...bindActionCreators({ getAllProfiles, push }, dispatch)
    }
}

class Group extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isProfilesMenuOpen: false
        }
    }
    componentDidMount(){
        if(!this.props.token ) return this.props.push('/login')
        const { profiles } = this.props
        if(profiles === [] || profiles.length === 1){
            this.props.getAllProfiles()
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
                {profiles.map(
                    p => <ProfileListItem
                        key={p.id}
                        onClick={e => goToProfile(p.id)}
                        name={p.name}
                    />
                )}
            </SlidingList>
        </React.Fragment>
    }
}

export default connect(mapState, mapDispatch)(Group)