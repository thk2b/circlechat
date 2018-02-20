import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { get } from '../actions'

import { Nav } from '../../nav'


const mapState = ({ profiles }, { match }) => {
    const id = match.params.id || profiles.ownProfileId
    return {
        ...profiles.data[id]
    }
    
}
const mapDispatch = dispatch => {
    return bindActionCreators({ get }, dispatch)
}

class Profile extends React.Component {
    componentDidMount = () => {
        const { id, userId, name, description, status } = this.props
        if(description || description === "") return
        this.props.get(id)
    }   
    
    render() {
        const { id, userId, name, description, status } = this.props
        return <div>
            <Nav />
            <h1>{name}</h1>
            <h2>#{userId}</h2>
            <p>{description}</p>
            <p>{status}</p>
        </ div>
    }
}


export default connect(mapState, mapDispatch)(Profile)
