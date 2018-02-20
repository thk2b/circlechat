import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { getAll as getAllProfiles } from '../profiles'


const mapState = ({ auth, profiles }) => {
    return {
        token: auth.token,
        profiles: Object.keys(profiles.data).reduce(
            (arr, id) => profiles.data[id]
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
            ui: { isUsersMenuOpen: false }
        }
    }
    componentDidMount(){
        if(!this.props.token ) return this.props.push('/login')
        if(this.props.profiles === [] || this.props.profiles.length === 1) console.log(true)
    }
    
    render() {
        return <div>
            {JSON.stringify(this.props)}
        </div>
    }
}

export default connect(mapState, mapDispatch)(Group)