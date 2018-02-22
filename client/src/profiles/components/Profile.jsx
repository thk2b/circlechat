import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { Info, Spinner } from '../../lib/components'
import { Nav } from '../../nav'

import { get } from '../actions'
import css from './Profile.css'

const mapState = ({ profiles }, { match }) => {
    const id = match.params.id || profiles.ownProfileId
    const { loading, error, success } = profiles
    return {
        ...profiles.data[id], id,
        loading, error, success
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
        this.props.push('/login')
    }   
    
    render() {
        const { 
            userId, name, description, status,
            loading, error, success
        } = this.props
        return <React.Fragment>
            <Nav />
            <div className={css.Profile}>
                <h1>{name}</h1>
                <h2>{userId}</h2>
                <p>{description}</p>
                <p>{status}</p>
                {loading && <Spinner>loading</Spinner>}
                {error && <Info danger>{error.message}</Info>}
                {success && <Info success>{success.message}</Info>}
            </ div>
        </React.Fragment>  
    }
}

export default connect(mapState, mapDispatch)(Profile)