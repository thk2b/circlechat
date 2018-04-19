import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import BackIcon from 'material-ui-icons/ArrowBack'

import { Spinner, Editable } from '../../lib'

import { get, update } from '../../../store/modules/profiles/networkActions'
import css from './Profile.css'

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.default
    }
})

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
            classes,
            userId, name, description, status, id: profileId,
            loading, request, device
        } = this.props

        const Container = device.isMobile? 'div' : Paper
        return <div className={css.Profile + ' ' + classes.root}>
            <Container className={css.ProfileContainer}>
                <Editable
                    onSubmit={name => this.props.update(profileId, { name })}
                    value={name}
                >
                    <Typography className={css.Name}>{name}</Typography>
                </Editable>
                <Typography>{userId}</Typography>
                <Editable
                    onSubmit={description => this.props.update(profileId, { description })}
                    isTextarea
                    value={description||''}
                >
                    <Typography>{description||'no description yet'}</Typography>
                </Editable>
                <Typography>{status}</Typography>
                {loading && 'loading'}
            </Container>
        </ div>
    }
}

export default withStyles(styles)(connect(mapState, mapDispatch)(Profile))