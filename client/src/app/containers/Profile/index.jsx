import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Paper from 'material-ui/Paper'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'
// import Snackbar from 'material-ui/Snackbar'
import { Spinner, Editable } from '../../lib'

import { get, update } from '../../../store/modules/profiles'
import css from './Profile.css'

const mapState = ({ profiles, device }, { match }) => {
    const id = match.params.id || profiles.ownProfileId
    const { loading, request } = profiles
    return {
        ...profiles.data[id], id,
        loading, request, device
    }
}
const mapDispatch = dispatch => {
    return bindActionCreators({ get, update }, dispatch)
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
            loading, request, device
        } = this.props

        const Container = device.isMobile? 'div' : Paper
        return <div className={css.Profile}>
            <Toolbar>
                {this.props.onBack && <ToolbarGroup>
                    <BackIcon onClick={e => this.props.onBack() }/>
                </ToolbarGroup>}
            </Toolbar>
            <Container className={css.ProfileContainer}>
                <Editable
                    onSubmit={name => this.props.update(profileId, { name })}
                    value={name}
                >
                    <h1 className={css.Name}>{name}</h1>
                </Editable>
                <h2>{userId}</h2>
                <Editable
                    onSubmit={description => this.props.update(profileId, { description })}
                    isTextarea
                    value={description||''}
                >
                    {description||'no description yet'}
                </Editable>
                <p>{status}</p>
                {loading && 'loading'}
            </Container>
        </ div>
    }
}

export default connect(mapState, mapDispatch)(Profile)