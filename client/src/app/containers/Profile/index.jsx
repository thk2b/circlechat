import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { RequestStatus, Spinner } from '../../lib'
import Nav from '../Nav'

import { get } from '../../../store/modules/profiles'
import css from './Profile.css'

const mapState = ({ profiles }, { match }) => {
    const id = match.params.id || profiles.ownProfileId
    const { loading, request } = profiles
    return {
        ...profiles.data[id], id,
        loading, request
    }
}
const mapDispatch = dispatch => bindActionCreators({ get, push }, dispatch)

class Profile extends React.Component {
    componentDidMount = () => {
        const { id, description } = this.props
        if(description || description === "") return
        if(id){
            return this.props.get(id)
        }
    }   
    
    render() {
        const { 
            userId, name, description, status,
            loading, request
        } = this.props
        return <React.Fragment>
            <Nav />
            <div className={css.Profile}>
                <h1>{name}</h1>
                <h2>{userId}</h2>
                <p>{description||<i>no description</i>}</p>
                <p>{status}</p>
                {loading && 'loading'}
                <RequestStatus request={request}/>
            </ div>
        </React.Fragment>  
    }
}

export default connect(mapState, mapDispatch)(Profile)