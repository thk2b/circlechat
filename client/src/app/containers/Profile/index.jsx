import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'
import MdCancel from 'react-icons/lib/md/cancel'

import { RequestStatus, Spinner, Editable } from '../../lib'

import { get, update } from '../../../store/modules/profiles'
import css from './Profile.css'

const mapState = ({ profiles }, { match }) => {
    const id = match.params.id || profiles.ownProfileId
    const { loading, request } = profiles
    return {
        ...profiles.data[id], id,
        loading, request
    }
}
const mapDispatch = dispatch => {
    return bindActionCreators({ get, update, push, goBack }, dispatch)
}

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
            userId, name, description, status, id: profileId,
            loading, request
        } = this.props
        return <div className={css.Profile}>
            <MdCancel onClick={e => this.props.goBack()}/>
            <Editable
                onSubmit={name => this.props.update(profileId, { name })}
                as='h1'
                className={css.Name}
                value={name}
            />
            <h2>{userId}</h2>
            <Editable
                onSubmit={description => this.props.update(profileId, { description })}
                as='p'
                isTextarea
                className={css.Description}
                value={description||'no description yet'}
            />
            <p>{status}</p>
            {loading && 'loading'}
            <RequestStatus request={request}/>
        </ div>
    }
}

export default connect(mapState, mapDispatch)(Profile)