import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import SlidingList from '../lib/components/SlidingList'
import ContextMenu from '../lib/components/ContextMenu'

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
    return bindActionCreators({ getAllProfiles, push }, dispatch)
}

class Group extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isUsersMenuOpen: false
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
            isUsersMenuOpen: !this.state.isUsersMenuOpen
        })
    }
    render() {
        const { isUsersMenuOpen } = this.state
        const { profiles } = this.props
        return <div>
            <ContextMenu>
                <button onClick={e => this.toggleMenu('users')}>users</button>
            </ContextMenu>
            <SlidingList right isOpen={isUsersMenuOpen}>
                {profiles.map(
                    p => <li key={p.id}>{p.name}</li>
                )}
            </SlidingList>


        </div>
    }
}

export default connect(mapState, mapDispatch)(Group)